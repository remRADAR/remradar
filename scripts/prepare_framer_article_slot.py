from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
path = root / "public" / "framer-site" / "index.html"
soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")

article_nodes = []
for node in soup.find_all(string=lambda value: value and " ".join(value.split()) == "ARTICLES"):
    parent = node.parent
    anchor = parent.find_parent("a")
    if anchor and anchor not in article_nodes:
        article_nodes.append(anchor)

if len(article_nodes) != 1:
    raise SystemExit(f"Expected exactly one Framer ARTICLES CTA, found {len(article_nodes)}")

anchor = article_nodes[0]
classes = anchor.get("class", [])
if "radar-article-cta" not in classes:
    classes.append("radar-article-cta")
    anchor["class"] = classes

existing = soup.find(id="radar-article-stack-slot")
if existing is None:
    slot = soup.new_tag("div", id="radar-article-stack-slot")
    slot["aria-label"] = "RADARArticles"
    anchor.insert_after(slot)

path.write_text(str(soup), encoding="utf-8")
print({"article_cta_count": len(article_nodes), "slot_present": soup.find(id="radar-article-stack-slot") is not None})
