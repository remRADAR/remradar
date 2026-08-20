#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
input="/home/ubuntu/Downloads/Video.gif"
webm="public/framer-site/_deps/images/aktiv-section-loop.webm"
mp4="public/framer-site/_deps/images/aktiv-section-loop.mp4"
ffmpeg -hide_banner -loglevel error -y -i "$input" \
  -vf "fps=30,format=yuv420p" -an \
  -c:v libvpx-vp9 -crf 31 -b:v 0 -row-mt 1 -deadline good -cpu-used 4 \
  "$webm"
ffmpeg -hide_banner -loglevel error -y -i "$input" \
  -vf "fps=30,format=yuv420p" -an \
  -c:v libx264 -crf 24 -preset medium -movflags +faststart \
  "$mp4"
for output in "$webm" "$mp4"; do
  echo "--- $output ---"
  ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height,avg_frame_rate,nb_frames,duration,pix_fmt \
    -of default=noprint_wrappers=1 "$output"
  stat -c 'bytes=%s' "$output"
done
