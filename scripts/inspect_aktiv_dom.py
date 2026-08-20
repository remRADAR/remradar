from bs4 import BeautifulSoup
from pathlib import Path

html = Path('public/framer-site/aktiv-section-v4.html').read_text(errors='ignore')
soup = BeautifulSoup(html, 'html.parser')
for paragraph in soup.find_all('p'):
    text = paragraph.get_text(' ', strip=True)
    if 'Experience the perfect fusion' in text or text == 'AKT!V':
        print('MATCH', repr(text))
        node = paragraph
        for level in range(5):
            node = node.parent
            if node is None:
                break
            print('PARENT', level + 1, node.name, node.get('class'), node.get('data-framer-name'))
        if node:
            print('NEARBY_IMAGES', [(img.get('src'), img.get('class')) for img in node.find_all('img')])
print('ALL_AKT_TEXT', [p.get_text(' ', strip=True) for p in soup.find_all('p') if 'AKT' in p.get_text(' ', strip=True)])
print('IMAGE_COUNT', len(soup.find_all('img')))
print('IMAGE_SOURCES_SAMPLE', [img.get('src') for img in soup.find_all('img')][-20:])
