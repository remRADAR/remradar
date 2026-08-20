from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
path = root / "public" / "framer-site" / "index.html"
soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
style = soup.find("style", id="radar-background-bridge")
if style is None:
    raise SystemExit("Missing radar-background-bridge style block")
css = style.string or ""
marker = "RADAR final article edge offset"
if marker not in css:
    css += r'''

/* RADAR final article edge offset: compensate the parent flex centering at desktop only. */
@media (min-width: 641px) {
  #radar-article-stack-slot { position: relative; left: 5px; }
}
@media (max-width: 640px) {
  #radar-article-stack-slot { position: relative; left: 0; }
}
'''
style.string = css
path.write_text(str(soup), encoding="utf-8")
print({"edge_offset": marker in (style.string or "")})
