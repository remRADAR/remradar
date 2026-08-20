#!/usr/bin/env python3
"""Migrate public REM RADAR WordPress.com posts into radarcharts.net.

Dry-run is the default. Use --write explicitly to create destination posts.
The destination credentials must be supplied through environment variables:

  WP_DEST_URL=https://radarcharts.net
  WP_DEST_USERNAME=...
  WP_DEST_APP_PASSWORD=...

The source is public and uses the WordPress.com REST API. The migration is
idempotent when the destination RADAR Content Bridge plugin has registered the
_radar_source_url meta field.
"""

from __future__ import annotations

import argparse
import base64
import html
import json
import mimetypes
import os
import re
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import requests

DEFAULT_SOURCE_SITE = "remradar.wordpress.com"
DEFAULT_DEST_URL = "https://radarcharts.net"
USER_AGENT = "RADARCharts REM RADAR migration/1.0"


@dataclass
class MigrationStats:
    scanned: int = 0
    planned: int = 0
    created: int = 0
    skipped: int = 0
    failed: int = 0
    media_uploaded: int = 0
    media_failed: int = 0


class MigrationError(RuntimeError):
    pass


def clean_html(value: str | None) -> str:
    text = re.sub(r"<[^>]+>", " ", value or "")
    return re.sub(r"\s+", " ", html.unescape(text)).strip()


def source_api(site: str) -> str:
    return f"https://public-api.wordpress.com/wp/v2/sites/{site}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-site", default=os.getenv("WP_SOURCE_SITE", DEFAULT_SOURCE_SITE))
    parser.add_argument("--dest-url", default=os.getenv("WP_DEST_URL", DEFAULT_DEST_URL))
    parser.add_argument("--limit", type=int, default=0, help="Maximum posts to inspect; 0 means all available posts")
    parser.add_argument("--after", help="Only posts after this ISO date")
    parser.add_argument("--before", help="Only posts before this ISO date")
    parser.add_argument("--status", choices=("draft", "pending", "publish"), default="draft")
    parser.add_argument("--write", action="store_true", help="Actually create destination posts; omitted means dry-run")
    parser.add_argument("--update", action="store_true", help="Update a matching existing post instead of skipping it")
    parser.add_argument("--no-media", action="store_true", help="Do not download/upload featured images")
    parser.add_argument("--page-size", type=int, default=50, choices=range(1, 101))
    parser.add_argument("--sleep", type=float, default=0.15, help="Delay between destination requests")
    parser.add_argument("--log", default="migration-logs/remradar-publications.jsonl")
    return parser.parse_args()


def session_for(args: argparse.Namespace) -> requests.Session:
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT, "Accept": "application/json"})
    if args.write:
        username = os.getenv("WP_DEST_USERNAME")
        app_password = os.getenv("WP_DEST_APP_PASSWORD")
        if not username or not app_password:
            raise MigrationError("--write requires WP_DEST_USERNAME and WP_DEST_APP_PASSWORD")
        token = base64.b64encode(f"{username}:{app_password}".encode()).decode()
        session.headers["Authorization"] = f"Basic {token}"
    return session


def request_json(session: requests.Session, method: str, url: str, **kwargs: Any) -> tuple[requests.Response, Any]:
    response = session.request(method, url, timeout=30, **kwargs)
    content_type = response.headers.get("content-type", "")
    if response.status_code >= 400:
        raise MigrationError(f"{method} {url} returned {response.status_code}: {response.text[:400]}")
    if "json" not in content_type:
        raise MigrationError(f"{method} {url} did not return JSON ({content_type})")
    return response, response.json()


def fetch_source_posts(session: requests.Session, args: argparse.Namespace) -> list[dict[str, Any]]:
    base = source_api(args.source_site)
    posts: list[dict[str, Any]] = []
    page = 1
    while True:
        params: dict[str, Any] = {"page": page, "per_page": args.page_size, "_embed": "1", "orderby": "date", "order": "asc"}
        if args.after:
            params["after"] = args.after
        if args.before:
            params["before"] = args.before
        response, payload = request_json(session, "GET", f"{base}/posts", params=params)
        if not payload:
            break
        posts.extend(payload)
        if args.limit and len(posts) >= args.limit:
            return posts[: args.limit]
        total_pages = int(response.headers.get("X-WP-TotalPages", page))
        if page >= total_pages:
            break
        page += 1
    return posts


def terms_for(post: dict[str, Any]) -> list[str]:
    terms = post.get("_embedded", {}).get("wp:term", [])
    names: list[str] = []
    for group in terms:
        for term in group or []:
            name = clean_html(term.get("name"))
            if name and name.lower() not in {item.lower() for item in names}:
                names.append(name)
    return names


def featured_media(post: dict[str, Any]) -> dict[str, str] | None:
    media = post.get("_embedded", {}).get("wp:featuredmedia", [])
    if not media:
        return None
    item = media[0]
    source_url = item.get("source_url")
    if not source_url:
        return None
    return {"url": source_url, "alt_text": clean_html(item.get("alt_text"))}


def source_meta(post: dict[str, Any], source_site: str) -> dict[str, str]:
    return {
        "_radar_source_url": post.get("link", ""),
        "_radar_source_site": source_site,
        "_radar_source_id": str(post.get("id", "")),
    }


def find_existing(session: requests.Session, dest_api: str, dest_url: str, source_url: str) -> list[dict[str, Any]]:
    if not source_url:
        return []
    bridge_url = f"{dest_url.rstrip('/')}/wp-json/radarcharts/v1/migration-lookup"
    try:
        _, payload = request_json(session, "GET", bridge_url, params={"source_url": source_url})
        return payload if isinstance(payload, list) else []
    except MigrationError:
        _, payload = request_json(
            session,
            "GET",
            f"{dest_api}/posts",
            params={"per_page": 10, "meta_key": "_radar_source_url", "meta_value": source_url, "context": "edit"},
        )
        return payload if isinstance(payload, list) else []


def category_id(session: requests.Session, dest_api: str, name: str, write: bool, sleep_seconds: float) -> int | None:
    _, found = request_json(session, "GET", f"{dest_api}/categories", params={"search": name, "per_page": 100})
    for category in found:
        if category.get("name", "").casefold() == name.casefold():
            return int(category["id"])
    if not write:
        return None
    _, created = request_json(session, "POST", f"{dest_api}/categories", json={"name": name})
    time.sleep(sleep_seconds)
    return int(created["id"])


def upload_media(session: requests.Session, dest_api: str, media: dict[str, str], stats: MigrationStats, sleep_seconds: float) -> int | None:
    response = session.get(media["url"], timeout=45, stream=True)
    if response.status_code >= 400:
        stats.media_failed += 1
        return None
    content_type = response.headers.get("content-type", "") or mimetypes.guess_type(media["url"])[0] or "application/octet-stream"
    filename = Path(urlparse(media["url"]).path).name or "radar-featured-image"
    filename = re.sub(r"[^A-Za-z0-9._-]+", "-", filename)
    upload = session.post(
        f"{dest_api}/media",
        headers={"Content-Disposition": f'attachment; filename="{filename}"', "Content-Type": content_type},
        data=response.content,
        timeout=60,
    )
    if upload.status_code >= 400:
        stats.media_failed += 1
        return None
    payload = upload.json()
    media_id = int(payload["id"])
    if media.get("alt_text"):
        session.post(f"{dest_api}/media/{media_id}", json={"alt_text": media["alt_text"]}, timeout=30)
    stats.media_uploaded += 1
    time.sleep(sleep_seconds)
    return media_id


def post_payload(post: dict[str, Any], source_site: str, category_ids: list[int], media_id: int | None, status: str) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "title": clean_html(post.get("title", {}).get("rendered")) or "Untitled publication",
        "content": post.get("content", {}).get("rendered") or "",
        "excerpt": clean_html(post.get("excerpt", {}).get("rendered")) or "",
        "slug": post.get("slug") or None,
        "status": status,
        "date": post.get("date") or None,
        "categories": category_ids,
        "meta": source_meta(post, source_site),
    }
    if media_id:
        payload["featured_media"] = media_id
    return payload


def main() -> int:
    args = parse_args()
    stats = MigrationStats()
    log_path = Path(args.log)
    log_path.parent.mkdir(parents=True, exist_ok=True)
    session = session_for(args)
    dest_api = args.dest_url.rstrip("/") + "/wp-json/wp/v2"
    mode = "WRITE" if args.write else "DRY-RUN"
    print(f"[{mode}] {args.source_site} -> {args.dest_url} | status={args.status}")
    if args.write:
        print("Live writes enabled. Destination posts default to the selected status.")
    else:
        print("No destination writes will occur. Re-run with --write after reviewing the log.")

    try:
        posts = fetch_source_posts(session, args)
    except (requests.RequestException, MigrationError) as exc:
        print(f"Source fetch failed: {exc}", file=sys.stderr)
        return 2

    with log_path.open("a", encoding="utf-8") as log_file:
        for post in posts:
            stats.scanned += 1
            source_url = post.get("link", "")
            record: dict[str, Any] = {"time": datetime.now(timezone.utc).isoformat(), "source_url": source_url, "source_id": post.get("id"), "mode": mode}
            try:
                existing = find_existing(session, dest_api, args.dest_url, source_url) if args.write else []
                if existing and not args.update:
                    stats.skipped += 1
                    record.update({"action": "skip-existing", "destination_id": existing[0].get("id")})
                    print(f"SKIP  {post.get('title', {}).get('rendered', '')[:90]}")
                    log_file.write(json.dumps(record, ensure_ascii=False) + "\n")
                    continue

                categories = terms_for(post)
                category_ids: list[int] = []
                for category in categories:
                    if args.write:
                        category_id_value = category_id(session, dest_api, category, True, args.sleep)
                        if category_id_value:
                            category_ids.append(category_id_value)
                media_id = None
                if args.write and not args.no_media and featured_media(post):
                    media_id = upload_media(session, dest_api, featured_media(post), stats, args.sleep)  # type: ignore[arg-type]

                payload = post_payload(post, args.source_site, category_ids, media_id, args.status)
                stats.planned += 1
                record.update({"action": "update" if existing and args.update else "create", "title": payload["title"], "categories": categories})
                if args.write:
                    if existing and args.update:
                        response, created = request_json(session, "POST", f"{dest_api}/posts/{existing[0]['id']}", json=payload)
                    else:
                        response, created = request_json(session, "POST", f"{dest_api}/posts", json=payload)
                    stats.created += 1
                    record["destination_id"] = created.get("id")
                    time.sleep(args.sleep)
                    print(f"WRITE {created.get('id')} {payload['title'][:90]}")
                else:
                    print(f"PLAN  {payload['title'][:90]} | categories={categories or ['Uncategorized']}")
                log_file.write(json.dumps(record, ensure_ascii=False) + "\n")
            except (requests.RequestException, MigrationError, KeyError, ValueError) as exc:
                stats.failed += 1
                record.update({"action": "failed", "error": str(exc)})
                log_file.write(json.dumps(record, ensure_ascii=False) + "\n")
                print(f"FAIL  {source_url}: {exc}", file=sys.stderr)

    print(json.dumps(stats.__dict__, indent=2))
    return 1 if stats.failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
