from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
path = root / "public" / "framer-site" / "index.html"
soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
style = soup.find("style", id="radar-background-bridge")
if style is None:
    raise SystemExit("Missing radar-background-bridge style block")

css = style.string or ""
marker = "RADAR full-frame article refit"
if marker not in css:
    css += r'''

/* RADAR full-frame article refit: fill the authored rail, never the old 440px island. */
#radar-article-stack-slot { width: 100% !important; max-width: none !important; min-height: 304px !important; margin: 0 !important; }
#radar-article-stack-slot .radar-article-stack { width: 100% !important; max-width: none !important; min-height: 304px !important; }
#radar-article-stack-slot .radar-article-stack__cards { width: 100% !important; height: 266px !important; }
#radar-article-stack-slot .radar-article-card { width: 100% !important; max-width: none !important; border-radius: 20px; }
#radar-article-stack-slot .radar-article-card__title, #radar-article-stack-slot .radar-article-card__excerpt { max-width: min(720px, 88%); }
#radar-article-stack-slot .radar-article-stack.is-expanded { min-height: 650px !important; }
#radar-article-stack-slot .radar-article-stack.is-expanded .radar-article-stack__cards { height: 600px !important; }
@media (max-width: 640px) {
  #radar-article-stack-slot { width: 100% !important; min-height: 304px !important; }
  #radar-article-stack-slot .radar-article-stack { min-height: 304px !important; }
  #radar-article-stack-slot .radar-article-stack__cards { height: 266px !important; }
  #radar-article-stack-slot .radar-article-stack.is-expanded { min-height: 610px !important; }
  #radar-article-stack-slot .radar-article-stack.is-expanded .radar-article-stack__cards { height: 560px !important; }
}
'''
style.string = css
path.write_text(str(soup), encoding="utf-8")
print({"full_frame_refit": marker in (style.string or "")})
