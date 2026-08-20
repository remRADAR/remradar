from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
path = root / "public" / "framer-site" / "index.html"
soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")

script_id = "radar-article-dom-bridge"
if soup.find("script", id=script_id) is None:
    script = soup.new_tag("script", id=script_id)
    script.string = r'''
(() => {
  const install = () => {
    const articleText = [...document.querySelectorAll('a')].find((anchor) => anchor.textContent.trim() === 'ARTICLES');
    if (!articleText) return;
    articleText.classList.add('radar-article-cta');
    if (!document.getElementById('radar-article-stack-slot')) {
      const slot = document.createElement('div');
      slot.id = 'radar-article-stack-slot';
      slot.setAttribute('aria-label', 'RADARArticles');
      articleText.insertAdjacentElement('afterend', slot);
    }
  };
  install();
  window.addEventListener('load', install, { once: true });
  new MutationObserver(install).observe(document.documentElement, { childList: true, subtree: true });
})();
'''
    (soup.body or soup).append(script)

path.write_text(str(soup), encoding="utf-8")
print({"bridge_present": soup.find("script", id=script_id) is not None})
