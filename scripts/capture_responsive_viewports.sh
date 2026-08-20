#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/responsive-screenshots"
mkdir -p "$OUT_DIR"

for spec in "mobile-small:360:800" "mobile-large:390:844" "tablet:768:1024" "desktop:1280:900" "desktop-wide:1440:1000"; do
  IFS=: read -r name width height <<< "$spec"
  /usr/bin/chromium \
    --headless \
    --no-sandbox \
    --disable-gpu \
    --hide-scrollbars \
    --run-all-compositor-stages-before-draw \
    --virtual-time-budget=5000 \
    --window-size="${width},${height}" \
    --screenshot="$OUT_DIR/${name}.png" \
    "http://127.0.0.1:3000/" >/dev/null 2>&1
  printf '%s %sx%s %s\n' "$name" "$width" "$height" "$OUT_DIR/${name}.png"
done
