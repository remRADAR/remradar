from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
path = root / "public" / "framer-site" / "index.html"
soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")

for text in ["ARTICLES", "NOW READING..."]:
    print(f"=== {text} ===")
    for node in soup.find_all(string=lambda value, needle=text: value and needle in " ".join(value.split())):
        parent = node.parent
        print({
            "tag": parent.name,
            "classes": parent.get("class", []),
            "href": parent.get("href"),
            "text": " ".join(node.split()),
            "ancestors": [
                {"tag": ancestor.name, "classes": ancestor.get("class", []), "id": ancestor.get("id")}
                for ancestor in list(parent.parents)[:6]
            ],
        })
