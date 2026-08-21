from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

src = Path('public/radarcharts-logo.png')
out = Path('public/radarcharts-logo-transparent.png')
image = Image.open(src).convert('RGBA')
# Keep the authored wordmark band and avoid carrying the large gray canvas.
left, top, right, bottom = 180, 300, 1370, 650
crop = image.crop((left, top, right, bottom))
rgb = np.asarray(crop.convert('RGB')).astype(np.int16)
background = np.asarray(crop.convert('RGB').filter(ImageFilter.GaussianBlur(19))).astype(np.int16)
diff = np.abs(rgb - background).mean(axis=2)
brightness = rgb.mean(axis=2)
# Strong local contrast identifies the wordmark and its dimensional shadow;
# brighter lettering is retained even where the background is nearly uniform.
mask = np.clip((diff - 5.0) * 19.0, 0, 255)
mask = np.maximum(mask, np.clip((brightness - 188.0) * 3.2, 0, 255))
mask = Image.fromarray(mask.astype(np.uint8), 'L').filter(ImageFilter.GaussianBlur(0.7))
alpha = np.asarray(mask).copy()
# Remove low-contrast regions connected to the crop boundary, preserving the logo.
seed = alpha < 28
height, width = seed.shape
visited = np.zeros_like(seed, dtype=bool)
queue = deque()
for x in range(width):
    if seed[0, x]: queue.append((0, x))
    if seed[height - 1, x]: queue.append((height - 1, x))
for y in range(height):
    if seed[y, 0]: queue.append((y, 0))
    if seed[y, width - 1]: queue.append((y, width - 1))
while queue:
    y, x = queue.popleft()
    if visited[y, x]:
        continue
    visited[y, x] = True
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < height and 0 <= nx < width and seed[ny, nx] and not visited[ny, nx]:
            queue.append((ny, nx))
alpha[visited] = 0
# Suppress tiny residual noise while keeping the connected authored mark.
alpha[alpha < 12] = 0
rgba = np.asarray(crop).copy()
rgba[:, :, 3] = alpha
ys, xs = np.where(alpha > 8)
if len(xs) == 0:
    raise SystemExit('Transparent extraction produced no usable pixels')
pad = 14
x0, x1 = max(0, xs.min() - pad), min(width, xs.max() + pad + 1)
y0, y1 = max(0, ys.min() - pad), min(height, ys.max() + pad + 1)
rgba = rgba[y0:y1, x0:x1]
new_width = 1200
new_height = max(1, round(rgba.shape[0] * new_width / rgba.shape[1]))
rgba = np.asarray(Image.fromarray(rgba, 'RGBA').resize((new_width, new_height), Image.Resampling.LANCZOS))
Image.fromarray(rgba, 'RGBA').save(out, optimize=True, compress_level=9)
print(f'{out} {rgba.shape[1]}x{rgba.shape[0]} RGBA')
