from pathlib import Path
from bs4 import BeautifulSoup
from collections import Counter
import re

root = Path(__file__).resolve().parents[1]
path = root / 'public' / 'framer-site' / 'index.html'
soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')

print('TITLE:', soup.title.get_text(' ', strip=True) if soup.title else '')
print('DESCRIPTION:', (soup.find('meta', attrs={'name':'description'}) or {}).get('content', ''))
print('\nNAVIGATION:')
for a in soup.find_all('a'):
    text = ' '.join(a.get_text(' ', strip=True).split())
    href = a.get('href', '')
    if text or href.startswith('.') or href.startswith('/'):
        print(f'- {text or "(no text)"} -> {href}')

print('\nPAGE-LIKE INTERNAL LINKS:')
seen = set()
for a in soup.find_all('a', href=True):
    href = a['href']
    if href.startswith('./') and href not in seen:
        seen.add(href)
        print(href)

print('\nIMAGES:')
images = []
for tag in soup.find_all(['img', 'source']):
    src = tag.get('src') or tag.get('srcset') or tag.get('data-src') or ''
    if src:
        images.append(src)
for src, count in Counter(images).most_common():
    print(f'{count}x {src}')

print('\nSCRIPTS:')
for script in soup.find_all('script', src=True):
    print(script['src'])

text = soup.get_text(' ', strip=True)
print('\nVISIBLE TEXT SAMPLE:', ' '.join(text.split())[:1200])
print('\nFRAMER COMPONENT CLASS COUNTS:')
classes = Counter(c for tag in soup.find_all(class_=True) for c in tag.get('class', []) if c.startswith('framer-'))
for cls, count in classes.most_common(60):
    print(f'{count:>4} {cls}')
