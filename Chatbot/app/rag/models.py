"""Plain data types shared by the RAG pipeline."""

from dataclasses import asdict, dataclass, field


@dataclass(slots=True)
class Block:
    """One paragraph / bullet / quote from the PDF, with its place in the outline."""

    text: str
    kind: str  # "para" | "bullet" | "quote"
    page: int
    section_no: int  # 0 = cover page
    section_title: str
    subsection: str = ""  # e.g. "4.1 Cupshup"
    topic: str = ""  # unnumbered sub-heading, e.g. "B2B Lead Generation"


@dataclass(slots=True)
class Chunk:
    id: str
    text: str  # what gets embedded and shown to the LLM (includes the heading path)
    section: str  # category used for filtering, e.g. "experience"
    section_title: str
    heading: str  # "4.1 Cupshup › B2B Lead Generation"
    entities: list[str] = field(default_factory=list)  # e.g. ["cupshup"]
    page: int = 0

    def metadata(self) -> dict:
        data = asdict(self)
        data.pop("id")
        return data


@dataclass(slots=True)
class Match:
    chunk: Chunk
    score: float
    filtered: bool = False  # came from the metadata-filtered search
