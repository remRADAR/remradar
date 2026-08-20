from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/home/ubuntu/upload/IMG_2721.PNG')
PUBLIC = ROOT / 'public'

if not SOURCE.exists():
    raise SystemExit(f'Missing supplied logo: {SOURCE}')

with Image.open(SOURCE) as source:
    image = source.convert('RGB')
    # Preserve the supplied 3:2 composition while reducing transfer size.
    image.thumbnail((1536, 1024), Image.Resampling.LANCZOS)
    image.save(PUBLIC / 'radarcharts-logo.png', 'PNG', optimize=True)
    image.save(PUBLIC / 'radarcharts-logo.webp', 'WEBP', quality=88, method=6)
    image.thumbnail((1200, 800), Image.Resampling.LANCZOS)
    image.save(PUBLIC / 'open-graph.png', 'PNG', optimize=True)

for name in ('radarcharts-logo.png', 'radarcharts-logo.webp', 'open-graph.png'):
    path = PUBLIC / name
    with Image.open(path) as image:
        print(f'{name}\t{image.width}x{image.height}\t{path.stat().st_size} bytes')
