from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
path = root / "public" / "framer-site" / "index.html"
soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
style = soup.find("style", id="radar-background-bridge")
if style is None:
    raise SystemExit("Missing radar-background-bridge style block")
css = style.string or ""
marker = "RADAR edge-to-edge article frame"
if marker not in css:
    css += r'''

/* RADAR edge-to-edge article frame: remove only the inherited rail gutter around this component. */
#radar-article-stack-slot { width: calc(100% + clamp(32px, 4vw, 40px)) !important; margin-left: clamp(-20px, -2vw, -16px) !important; }
@media (max-width: 640px) {
  #radar-article-stack-slot { width: calc(100% + 32px) !important; margin-left: -16px !important; }
}
'''
style.string = css
path.write_text(str(soup), encoding="utf-8")
print({"edge_to_edge": marker in (style.string or "")})
