"""PDF → structured blocks.

The knowledge base PDF uses consistent styles, so headings are detected
from font size/weight instead of guessing from plain text:
  16pt bold   → section       ("4. Professional Experience")
  11.5pt bold → subsection    ("4.1 Cupshup") or topic ("B2B Lead Generation")
  7.5pt       → running header / footer (dropped)
  oblique     → first-person summary (kept as a quote)
"""

import re
from pathlib import Path

import pymupdf

from .models import Block

SECTION_SIZE = 15.0
HEADING_SIZE = 11.0
FURNITURE_SIZE = 8.0  # header/footer text is 7.5pt
TITLE_SIZE = 20.0

SECTION_RE = re.compile(r"^(\d{1,2})\.\s+(.+)$")
SUBSECTION_RE = re.compile(r"^\d{1,2}\.\d{1,2}\s+.+$")
BULLET = "•"
END_MARKER = re.compile(r"^End of .+Knowledge Base", re.IGNORECASE)


def _clean(text: str) -> str:
    text = text.replace(" ", " ").replace("‐", "-").replace("‑", "-")
    return re.sub(r"\s+", " ", text).strip()


def load_blocks(pdf_path: Path) -> list[Block]:
    """Read the PDF and return content blocks in reading order."""
    blocks: list[Block] = []
    section_no, section_title = 0, "Overview"
    subsection = topic = ""

    with pymupdf.open(pdf_path) as doc:
        for page_index, page in enumerate(doc, start=1):
            for raw in page.get_text("dict")["blocks"]:
                spans = [s for line in raw.get("lines", []) for s in line["spans"] if s["text"].strip()]
                if not spans:
                    continue
                size = max(s["size"] for s in spans)
                if size < FURNITURE_SIZE or size >= TITLE_SIZE:
                    continue  # running header/footer or the cover title

                text = _clean(" ".join(" ".join(s["text"] for s in line["spans"]) for line in raw["lines"]))
                if not text or END_MARKER.match(text):
                    continue
                bold = all("Bold" in s["font"] for s in spans)

                if section_no == 0:
                    if size >= 10.5 and not bold:
                        continue  # cover subtitle / purpose note: about the document, not Aman
                    label = _clean(" ".join(s["text"] for s in spans if "Bold" in s["font"]))
                    value = _clean(" ".join(s["text"] for s in spans if "Bold" not in s["font"]))
                    if label and value:  # cover table row: bold label + value
                        text, bold = f"{label}: {value}", False

                if bold and size >= SECTION_SIZE and (m := SECTION_RE.match(text)):
                    section_no, section_title = int(m.group(1)), text
                    subsection = topic = ""
                    continue
                if bold and size >= HEADING_SIZE:
                    if SUBSECTION_RE.match(text):
                        subsection, topic = text, ""
                    else:
                        topic = text
                    continue

                kind = "quote" if all("Oblique" in s["font"] or "Italic" in s["font"] for s in spans) else "para"
                if text.startswith(BULLET):
                    kind, text = "bullet", text.lstrip(BULLET).strip()

                blocks.append(
                    Block(
                        text=text,
                        kind=kind,
                        page=page_index,
                        section_no=section_no,
                        section_title=section_title,
                        subsection=subsection,
                        topic=topic,
                    )
                )
    return blocks
