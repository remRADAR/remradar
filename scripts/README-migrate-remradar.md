# REM RADAR publication migration

`scripts/migrate_remradar_publications.py` imports public publications from `remradar.wordpress.com` into the new `radarcharts.net` WordPress site.

## Safety model

The script is **dry-run by default**. It never writes to the destination unless `--write` is supplied. The destination credentials are read only from environment variables and are never written to the audit log.

The migration creates destination posts as drafts by default. Review the draft content in WordPress before publishing. Use `--status publish` only after a reviewed test batch.

## Environment

```bash
export WP_DEST_URL=https://radarcharts.net
export WP_DEST_USERNAME='your-wordpress-editor-username'
export WP_DEST_APP_PASSWORD='xxxx xxxx xxxx xxxx xxxx xxxx'
export WP_SOURCE_SITE=remradar.wordpress.com
```

Use a WordPress Application Password for the destination account. Do not use the account’s normal password and do not commit these variables to Git.

## Dry-run examples

Preview the first ten source posts without contacting the destination for writes:

```bash
python3 scripts/migrate_remradar_publications.py \
  --limit 10 \
  --log migration-logs/remradar-preview.jsonl
```

Preview a date range:

```bash
python3 scripts/migrate_remradar_publications.py \
  --after 2020-01-01T00:00:00 \
  --before 2025-12-31T23:59:59 \
  --limit 50 \
  --log migration-logs/remradar-2020-2025.jsonl
```

## Controlled write

Run a small draft batch first:

```bash
python3 scripts/migrate_remradar_publications.py \
  --limit 10 \
  --status draft \
  --write \
  --log migration-logs/remradar-draft-batch.jsonl
```

The script preserves the source post URL, source site, and source ID in private destination metadata. The installed RADARCharts Content Bridge exposes a protected migration lookup route for exact duplicate detection. Re-running the same command skips matching source URLs.

To migrate older content without downloading featured images, add `--no-media`. To intentionally update already-imported records, add `--update`; this should only be used after reviewing the audit log.

## Audit log

Each source record is written as one JSON object in the log, including the action (`create`, `skip-existing`, `update`, or `failed`), source URL, source ID, title, categories, destination ID when available, and timestamp. Credentials are never logged.

The script does not delete source or destination posts. If a batch must be reversed, use the audit log’s destination IDs and review/delete those imported drafts in WordPress manually.
