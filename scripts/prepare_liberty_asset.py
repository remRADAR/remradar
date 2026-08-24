from pathlib import Path
from PIL import Image

source = Path('public/media/home/radarcharts-statue-hero.webp')
target = Path('public/media/liberty-statue.png')
with Image.open(source) as image:
    image.convert('RGBA').save(target, format='PNG', optimize=True)
print(f'created {target} from {source}: {image.size[0]}x{image.size[1]} RGBA')
