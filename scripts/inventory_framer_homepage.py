from __future__ import annotations

import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'public/framer-site/aktiv-section-v4.html'
OUTPUT = ROOT / 'content/homepage-component-inventory.json'

SECTION_RE = re.compile(r'^Section|^Content|^Now|^RADAR|^Ticker|^Hero|^Showreel|^Music|^Footer|^Bottom|^Top25|^RDR|^Article', re.I)

with SOURCE.open(encoding='utf-8') as handle:
    soup = BeautifulSoup(handle.read(), 'html.parser')

sections = []
for node in soup.find_all(attrs={'data-framer-name': True}):
    name = node.get('data-framer-name', '').strip()
    if not name or not SECTION_RE.search(name):
        continue
    if node.find_parent(attrs={'data-framer-name': name}):
        continue
    images = [
        {
            'src': image.get('src', ''),
            'alt': image.get('alt', ''),
            'selector': f'[data-framer-name="{name}"] img',
        }
        for image in node.find_all('img')
    ]
    videos = [
        {
            'src': video.get('src', ''),
            'selector': f'[data-framer-name="{name}"] video',
        }
        for video in node.find_all('video')
    ]
    text_nodes = []
    for element in node.find_all(['h1', 'h2', 'h3', 'p']):
        text = ' '.join(element.get_text(' ', strip=True).split())
        if text:
            text_nodes.append({
                'text': text[:240],
                'tag': element.name,
                'selector': f'[data-framer-name="{name}"] {element.name}',
            })
    if images or videos or text_nodes:
        sections.append({
            'id': re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-'),
            'name': name,
            'selector': f'[data-framer-name="{name}"]',
            'images': images,
            'videos': videos,
            'textSlots': text_nodes,
        })

inventory = {
    'version': 1,
    'source': 'public/framer-site/aktiv-section-v4.html',
    'generatedAt': '2026-08-20T00:00:00.000Z',
    'sections': sections,
}
OUTPUT.write_text(json.dumps(inventory, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print(f'sections={len(sections)} output={OUTPUT}')
for section in sections:
    print(f"{section['id']}: images={len(section['images'])} videos={len(section['videos'])} text={len(section['textSlots'])}")
