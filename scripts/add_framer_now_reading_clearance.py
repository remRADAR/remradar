from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
path = root / "public" / "framer-site" / "index.html"
soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
style = soup.find("style", id="radar-background-bridge")
if style is None:
    raise SystemExit("Missing radar-background-bridge style block")
css = style.string or ""
rule = "\n#hz7xvy { margin-top: 64px !important; }"
if "#hz7xvy { margin-top:" not in css:
    style.string = css + rule
path.write_text(str(soup), encoding="utf-8")
print({"clearance_present": "#hz7xvy { margin-top: 64px" in (style.string or "")})
