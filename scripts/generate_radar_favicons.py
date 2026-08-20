from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/home/ubuntu/upload/IMG_3493.WEBP')
PUBLIC = ROOT / 'public'

if not SOURCE.exists():
    raise SystemExit(f'Missing supplied favicon image: {SOURCE}')

with Image.open(SOURCE) as source:
    image = source.convert('RGBA')
    if image.width != image.height:
        size = min(image.width, image.height)
        left = (image.width - size) // 2
        top = (image.height - size) // 2
        image = image.crop((left, top, left + size, top + size))

    for size, name in ((16, 'favicon-16x16.png'), (32, 'favicon-32x32.png'), (180, 'apple-icon-180x180.png'), (192, 'android-icon-192x192.png')):
        image.resize((size, size), Image.Resampling.LANCZOS).save(PUBLIC / name, 'PNG', optimize=True)

    image.resize((32, 32), Image.Resampling.LANCZOS).save(PUBLIC / 'favicon.ico', 'ICO', sizes=[(32, 32), (16, 16)])

print(f'source={SOURCE.name} dimensions={image.width}x{image.height}')
for name in ('favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-icon-180x180.png', 'android-icon-192x192.png'):
    path = PUBLIC / name
    print(f'{name}\t{path.stat().st_size} bytes')
