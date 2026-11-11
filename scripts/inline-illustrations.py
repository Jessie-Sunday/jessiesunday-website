"""Embed SVG symbols so illustrations also render when HTML is opened from disk.

Run after editing illustrations/*.svg or adding an external illustration <use>.
Only referenced symbols are copied; original SVG files remain the source artwork.
"""

from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BLOCK = re.compile(r"<!-- inline-illustrations:start -->.*?<!-- inline-illustrations:end -->\n?", re.S)
USE = re.compile(r"<use\b[^>]*>", re.S)
SOURCE = re.compile(r'(?:data-illustration|href)="((?:\.\./)*illustrations/[^"#]+\.svg#[^"]+)"')

for page in sorted(ROOT.rglob("*.html")):
    original = page.read_text()
    html = BLOCK.sub("", original)
    embedded = set()

    def inline(match):
        tag = match.group()
        source = SOURCE.search(tag)
        if not source:
            return tag
        reference = source[1]
        filename, symbol_id = reference.split("#")
        path = (page.parent / filename).resolve()
        local_id = f"illustration-{path.stem}-{symbol_id}"
        svg = path.read_text()
        # Keep the original path data and formatting exactly as authored.
        symbol = re.search(r'<symbol\b[^>]*\bid="' + re.escape(symbol_id) + r'"[^>]*>.*?</symbol>', svg, re.S)
        if symbol is None:
            raise ValueError(f"Missing illustration: {reference} in {page}")
        ET.fromstring(symbol[0])
        tag = re.sub(r'\bhref="[^"]*"', f'href="#{local_id}"', tag)
        if "data-illustration=" not in tag:
            tag = tag.replace("<use", f'<use data-illustration="{reference}"', 1)
        if local_id in embedded:
            return tag
        embedded.add(local_id)
        definition = symbol[0].replace(f'id="{symbol_id}"', f'id="{local_id}"', 1)
        return "<!-- inline-illustrations:start --><defs>" + definition + "</defs><!-- inline-illustrations:end -->\n" + tag

    html = USE.sub(inline, html)
    if html != original:
        page.write_text(html)
        print(f"Updated {page.relative_to(ROOT)} ({len(embedded)} symbols)")
