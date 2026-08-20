from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
path = root / "public" / "framer-site" / "index.html"
soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
style = soup.find("style", id="radar-background-bridge")
if style is None:
    raise SystemExit("Missing radar-background-bridge style block")

css = style.string or ""
replacements = {
    "#radar-article-stack-slot { display: block !important; width: min(100%, 440px); min-height: 300px; margin: 0 auto; overflow: visible !important; position: relative; z-index: 5; }": "#radar-article-stack-slot { display: block !important; width: min(100%, 440px); min-height: 300px; margin: 0 auto; overflow: visible !important; position: relative; z-index: 5; }\n.framer-1k80cd9 { height: auto !important; min-height: 0 !important; overflow: visible !important; }",
    ".radar-article-stack.is-expanded .radar-article-card { transform: translateY(calc(var(--stack-index) * 152px)); }": ".radar-article-stack.is-expanded .radar-article-card { height: 140px; bottom: auto; transform: translateY(calc(var(--stack-index) * 152px)); }",
    "  .radar-article-stack.is-expanded .radar-article-card { transform: translateY(calc(var(--stack-index) * 140px)); }": "  .radar-article-stack.is-expanded .radar-article-card { height: 124px; bottom: auto; transform: translateY(calc(var(--stack-index) * 140px)); }",
}
for old, new in replacements.items():
    css = css.replace(old, new)
style.string = css
path.write_text(str(soup), encoding="utf-8")
print({"parent_auto": ".framer-1k80cd9 { height: auto" in css, "compact_expanded_cards": "height: 140px" in css})
