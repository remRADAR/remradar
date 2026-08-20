from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/home/ubuntu/Downloads/Video.gif')
OUT = ROOT / 'public/framer-site/_deps/images'
OUT.mkdir(parents=True, exist_ok=True)

if not SOURCE.exists():
    raise SystemExit(f'Missing source GIF: {SOURCE}')

poster = OUT / 'aktiv-section-poster.jpg'
webm = OUT / 'aktiv-section-loop-mobile.webm'
mp4 = OUT / 'aktiv-section-loop-mobile.mp4'

subprocess.run([
    'ffmpeg', '-y', '-i', str(SOURCE), '-vf', 'scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2:color=black',
    '-frames:v', '1', '-q:v', '3', str(poster)
], check=True)

subprocess.run([
    'ffmpeg', '-y', '-i', str(SOURCE), '-vf', 'scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2:color=black,fps=20',
    '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '34', '-deadline', 'good', '-cpu-used', '5', '-row-mt', '1', '-tile-columns', '1', '-g', '40', str(webm)
], check=True)

subprocess.run([
    'ffmpeg', '-y', '-i', str(SOURCE), '-vf', 'scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2:color=black,fps=20',
    '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '30', '-movflags', '+faststart', str(mp4)
], check=True)

for path in (poster, webm, mp4):
    print(f'{path.name}\t{path.stat().st_size} bytes')
