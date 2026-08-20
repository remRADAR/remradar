from pathlib import Path
from PIL import Image

SOURCE = Path('/home/ubuntu/upload/IMG_3493.WEBP')
ROOT = Path('/home/ubuntu/radarcharts-next16')
PUBLIC = ROOT / 'public'

image = Image.open(SOURCE).convert('RGBA')
side = min(image.size)
left = (image.width - side) // 2
top = (image.height - side) // 2
square = image.crop((left, top, left + side, top + side))

# Keep the full moon/silhouette artwork, with a tiny inset so favicon masks do not clip the edge.
def export(name: str, size: int) -> None:
    icon = square.resize((size, size), Image.Resampling.LANCZOS)
    icon.save(PUBLIC / name, format='PNG', optimize=True)

export('radarmatrix-favicon-512.png', 512)
export('radarmatrix-favicon-180.png', 180)
export('favicon-16x16.png', 16)
export('favicon-32x32.png', 32)
export('apple-icon-180x180.png', 180)

# Pillow writes a standards-compliant multi-resolution ICO for the App Router icon.
ico = square.resize((256, 256), Image.Resampling.LANCZOS)
ico.save(PUBLIC / 'favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
# The App Router convention takes precedence over public/favicon.ico for /favicon.ico.
ico.save(ROOT / 'src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])

print(f'Generated RADARMatrix favicon assets from {SOURCE}')
print(f'Source dimensions: {image.width}x{image.height}; square crop: {square.width}x{square.height}')
