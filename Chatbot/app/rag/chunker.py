"""Structure-aware chunking.

Strategy (why, not just how):
1. Group blocks by their place in the outline (section → subsection →
   topic). A chunk never mixes two companies or two projects, so retrieval
   stays precise and metadata filters stay truthful.
2. Prefix every chunk with its heading path ("Aman Dwivedi knowledge base ›
   4. Professional Experience › 4.1 Cupshup"). The heading carries the key
   context (which company/project) that the body often omits, and it is
   embedded together with the text.
3. Small neighbouring units are packed together up to ~850 characters
   (e.g. the one-line skill lists), so no chunk is too thin to embed well.
   In experience/projects only units of the same subsection are packed.
4. Units longer than the limit are split on paragraph/bullet boundaries with
   a one-block overlap, so a list is never cut mid-item and context carries
   across the split.
Sections 11–12 (bot policy, maintenance notes) are excluded.
"""

import hashlib
from dataclasses import dataclass, field

from .catalog import EXCLUDED_SECTIONS, ISOLATED_SECTIONS, SECTION_CATEGORIES, find_entities
from .models import Block, Chunk

SEP = " › "


@dataclass
class _Unit:
    section_no: int
    section_title: str
    subsection: str
    topic: str
    blocks: list[Block] = field(default_factory=list)

    @property
    def key(self) -> tuple:
        return (self.section_no, self.subsection, self.topic)

    def body(self) -> str:
        lines = []
        for b in self.blocks:
            if b.kind == "bullet":
                lines.append(f"- {b.text}")
            elif b.kind == "quote":
                lines.append(f'In Aman\'s words: "{b.text}"')
            else:
                lines.append(b.text)
        return "\n".join(lines)


def _units(blocks: list[Block]) -> list[_Unit]:
    units: list[_Unit] = []
    for b in blocks:
        if b.section_no in EXCLUDED_SECTIONS:
            continue
        if not units or units[-1].key != (b.section_no, b.subsection, b.topic):
            units.append(_Unit(b.section_no, b.section_title, b.subsection, b.topic))
        units[-1].blocks.append(b)
    return units


def _split_long(unit: _Unit, target: int, limit: int) -> list[_Unit]:
    """Split an oversized unit on block boundaries, overlapping one block."""
    if len(unit.body()) <= limit:
        return [unit]
    parts: list[_Unit] = []
    current = _Unit(unit.section_no, unit.section_title, unit.subsection, unit.topic)
    for block in unit.blocks:
        if current.blocks and len(current.body()) + len(block.text) > target:
            parts.append(current)
            current = _Unit(unit.section_no, unit.section_title, unit.subsection, unit.topic, current.blocks[-1:])
        current.blocks.append(block)
    parts.append(current)
    return parts


def _can_join(group: list[_Unit], unit: _Unit, target: int) -> bool:
    last = group[-1]
    if last.section_no != unit.section_no:
        return False
    if unit.section_no in ISOLATED_SECTIONS and last.subsection != unit.subsection:
        return False
    return sum(len(u.body()) for u in group) + len(unit.body()) <= target


def _pack(units: list[_Unit], target: int) -> list[list[_Unit]]:
    groups: list[list[_Unit]] = []
    for unit in units:
        if groups and _can_join(groups[-1], unit, target):
            groups[-1].append(unit)
        else:
            groups.append([unit])
    return groups


def _render(group: list[_Unit]) -> tuple[str, str]:
    """Return (heading, body) for a group of units."""
    subsections = list(dict.fromkeys(u.subsection for u in group if u.subsection))
    if len(subsections) <= 1:
        heading = subsections[0] if subsections else group[0].section_title
        if len(group) == 1 and group[0].topic:
            return f"{heading}{SEP}{group[0].topic}", group[0].body()
        # same subsection: label each part by its topic only
        parts = [f"{u.topic}\n{u.body()}" if u.topic else u.body() for u in group]
        return heading, "\n\n".join(parts)
    # several subsections (e.g. 6.1 + 6.2 skills lists): label each part
    parts = [f"{SEP.join(p for p in (u.subsection, u.topic) if p)}\n{u.body()}" for u in group]
    return " · ".join(subsections), "\n\n".join(parts)


def build_chunks(blocks: list[Block], target: int = 850, limit: int = 1100) -> list[Chunk]:
    units = [part for unit in _units(blocks) for part in _split_long(unit, target, limit)]
    chunks: list[Chunk] = []
    for group in _pack(units, target):
        first = group[0]
        heading, body = _render(group)
        path = f"Aman Dwivedi knowledge base{SEP}{first.section_title}"
        if heading != first.section_title:
            path += f"{SEP}{heading}"
        digest = hashlib.sha1(f"{heading}\n{body}".encode()).hexdigest()[:10]
        chunks.append(
            Chunk(
                id=f"kb-s{first.section_no:02d}-{digest}",
                text=f"{path}\n{body}",
                section=SECTION_CATEGORIES.get(first.section_no, "other"),
                section_title=first.section_title,
                heading=heading,
                entities=find_entities(f"{heading}\n{body}"),
                page=first.blocks[0].page,
            )
        )
    return chunks
