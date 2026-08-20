from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
path = root / "public" / "framer-site" / "index.html"
soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
style = soup.find("style", id="radar-background-bridge")
if style is None:
    raise SystemExit("Missing radar-background-bridge style block")
css = style.string or ""
old = ".framer-sVFBc .framer-1k80cd9 { height: auto !important; min-height: 0 !important; overflow: visible !important; }"
new = ".framer-1k80cd9 { height: auto !important; min-height: 0 !important; overflow: visible !important; }"
css = css.replace(old, new)
style.string = css
path.write_text(str(soup), encoding="utf-8")
print({"replaced": old not in css, "direct_rule": new in css})
