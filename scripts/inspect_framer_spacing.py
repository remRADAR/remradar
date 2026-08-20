from __future__ import annotations

import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
html_path = root / "public" / "framer-site" / "index.html"
html = html_path.read_text(encoding="utf-8")
soup = BeautifulSoup(html, "html.parser")

matches = []
for element in soup.find_all(string=lambda value: value and "NOW READING" in value):
    node = element.parent
    ancestors = []
    for ancestor in list(node.parents)[:6]:
        style = ancestor.get("style", "")
        classes = ancestor.get("class", [])
        ancestors.append({
            "tag": ancestor.name,
            "classes": classes,
            "style": style,
        })
    matches.append({
        "tag": node.name,
        "classes": node.get("class", []),
        "style": node.get("style", ""),
        "text": " ".join(element.split()),
        "ancestors": ancestors,
    })

class_rules = {}
for selector, body in re.findall(r"([^{}]+)\{([^{}]*)\}", html):
    if any(token in selector for token in ["smtg16", "hz7xvy", "1vr8u7o", "63hyh", "slideshow", "1k80cd9", "50j9t5"]):
        class_rules[selector.strip()] = body.strip()

media_rules = re.findall(r"@media[^{}]+\{(?:[^{}]*\{[^{}]*\}[^{}]*)+\}", html)

output = {
    "now_reading": matches,
    "relevant_rules": class_rules,
    "media_rule_count": len(media_rules),
}
(root / "framer_spacing_inventory.json").write_text(json.dumps(output, indent=2), encoding="utf-8")
print(json.dumps({"matches": len(matches), "relevant_rules": len(class_rules), "media_rule_count": len(media_rules)}, indent=2))
