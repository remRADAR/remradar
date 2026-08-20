from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
path = root / "public" / "framer-site" / "index.html"
soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
style = soup.find("style", id="radar-background-bridge")
if style is None:
    raise SystemExit("Missing radar-background-bridge style block")

css = r'''
/* RADAR article stack: the Next portal owns this slot; the authored sections stay intact. */
.radar-article-cta { display: none !important; }
#radar-article-stack-slot { display: block !important; width: min(100%, 440px); min-height: 300px; margin: 0 auto; overflow: visible !important; position: relative; z-index: 5; }
.framer-sVFBc .framer-1k80cd9 { height: auto !important; min-height: 0 !important; overflow: visible !important; }
.radar-article-stack { width: 100%; min-height: 300px; color: #fff; font-family: Inter, Arial, sans-serif; }
.radar-article-stack__header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 4px 10px; }
.radar-article-stack__eyebrow { margin: 0; color: rgba(255,255,255,.68); font-size: 10px; font-weight: 700; letter-spacing: .12em; line-height: 1.2; }
.radar-article-stack__toggle { appearance: none; border: 1px solid rgba(255,255,255,.24); border-radius: 999px; background: rgba(255,255,255,.08); color: #fff; cursor: pointer; font: inherit; font-size: 10px; line-height: 1; padding: 8px 11px; white-space: nowrap; }
.radar-article-stack__toggle:hover, .radar-article-stack__toggle:focus-visible { background: rgba(255,255,255,.16); outline: 2px solid rgba(255,255,255,.5); outline-offset: 2px; }
.radar-article-stack__cards { position: relative; height: 246px; width: 100%; }
.radar-article-card { display: block; position: absolute; inset: 0; overflow: hidden; border: 1px solid rgba(255,255,255,.22); border-radius: 18px; color: #fff !important; text-decoration: none !important; background: linear-gradient(135deg, rgba(45,54,68,.95), rgba(10,15,22,.98)); box-shadow: 0 16px 36px rgba(0,0,0,.24); transform: translateY(calc(var(--stack-index) * 9px)) scale(calc(1 - var(--stack-index) * .035)); transform-origin: center top; transition: transform 280ms cubic-bezier(.22,1,.36,1), filter 280ms ease; z-index: calc(10 - var(--stack-index)); }
.radar-article-card__image, .radar-article-card__shade { position: absolute; inset: 0; }
.radar-article-card__image { background-position: center; background-size: cover; filter: saturate(.85); opacity: .86; }
.radar-article-card__shade { background: linear-gradient(135deg, rgba(6,10,15,.25), rgba(6,10,15,.88) 80%); }
.radar-article-card__content { position: relative; display: flex; min-height: 100%; flex-direction: column; align-items: flex-start; justify-content: flex-end; gap: 7px; padding: 18px; }
.radar-article-card__category, .radar-article-card__link { color: rgba(255,255,255,.7); font-size: 9px; font-weight: 700; letter-spacing: .11em; line-height: 1.3; text-transform: uppercase; }
.radar-article-card__title { max-width: 330px; font-size: clamp(18px, 2.5vw, 25px); font-weight: 650; letter-spacing: -.02em; line-height: 1.03; }
.radar-article-card__excerpt { max-width: 330px; color: rgba(255,255,255,.72); font-size: 11px; line-height: 1.35; }
.radar-article-stack.is-expanded { min-height: 650px; }
.radar-article-stack.is-expanded .radar-article-stack__cards { height: 600px; }
.radar-article-stack.is-expanded .radar-article-card { height: 140px; bottom: auto; transform: translateY(calc(var(--stack-index) * 152px)); }
.radar-article-stack.is-expanded .radar-article-card:hover { filter: brightness(1.1); }
@media (max-width: 640px) {
  #radar-article-stack-slot { width: min(100%, calc(100vw - 32px)); min-height: 286px; }
  .radar-article-stack { min-height: 286px; }
  .radar-article-stack__cards { height: 234px; }
  .radar-article-stack.is-expanded { min-height: 610px; }
  .radar-article-stack.is-expanded .radar-article-stack__cards { height: 560px; }
  .radar-article-stack.is-expanded .radar-article-card { height: 124px; bottom: auto; transform: translateY(calc(var(--stack-index) * 140px)); }
  .radar-article-card__content { padding: 16px; }
  .radar-article-card__excerpt { max-width: 92%; }
}
'''

current = style.string or ""
if "RADAR article stack:" not in current:
    style.string = current + "\n" + css
path.write_text(str(soup), encoding="utf-8")
print({"style_injected": "RADAR article stack:" in (style.string or "")})
