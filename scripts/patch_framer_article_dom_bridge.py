from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
path = root / "public" / "framer-site" / "index.html"
soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
script = soup.find("script", id="radar-article-dom-bridge")
if script is None:
    raise SystemExit("Missing radar-article-dom-bridge")

source = script.string or ""
old = "articleText.classList.add('radar-article-cta');"
new = "articleText.classList.add('radar-article-cta');\n    const editorialParent = articleText.closest('.framer-1k80cd9');\n    editorialParent?.style.setProperty('height', 'auto', 'important');\n    editorialParent?.style.setProperty('min-height', '0', 'important');\n    editorialParent?.style.setProperty('overflow', 'visible', 'important');"
if "editorialParent" not in source:
    source = source.replace(old, new)
script.string = source
path.write_text(str(soup), encoding="utf-8")
print({"runtime_parent_patch": "editorialParent" in (script.string or "")})
