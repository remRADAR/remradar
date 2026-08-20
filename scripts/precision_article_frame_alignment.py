from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
path = root / "public" / "framer-site" / "index.html"
soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
style = soup.find("style", id="radar-background-bridge")
if style is None:
    raise SystemExit("Missing radar-background-bridge style block")
css = style.string or ""
marker = "RADAR precision article frame alignment"
if marker not in css:
    css += r'''

/* RADAR precision article frame alignment: exact iframe edges plus a safe following-section clearance. */
#radar-article-stack-slot { margin-left: -10px !important; }
#hz7xvy { margin-top: 72px !important; }
@media (max-width: 640px) {
  #radar-article-stack-slot { margin-left: -16px !important; }
  #hz7xvy { margin-top: 72px !important; }
}
'''
style.string = css
path.write_text(str(soup), encoding="utf-8")
print({"precision_alignment": marker in (style.string or "")})
