def test_page_furniture_is_removed(chunks):
    text = "\n".join(c.text for c in chunks)
    assert "For personal portfolio RAG ingestion" not in text
    assert "PERSONAL AI KNOWLEDGE BASE" not in text


def test_policy_and_maintenance_sections_are_not_indexed(chunks):
    text = "\n".join(c.text for c in chunks)
    assert "Out-of-Context Handling" not in text
    assert "Knowledge Base Maintenance" not in text
    assert {c.section for c in chunks} <= {
        "profile", "journey", "education", "experience", "projects", "skills", "interests", "goals", "learning", "hr",
    }


def test_chunk_sizes_and_unique_ids(chunks):
    assert 20 <= len(chunks) <= 60
    assert len({c.id for c in chunks}) == len(chunks)
    assert all(len(c.text) <= 1300 for c in chunks)


def test_every_chunk_carries_its_heading_path(chunks):
    assert all(c.text.startswith("Aman Dwivedi knowledge base › ") for c in chunks)


def test_experience_and_project_chunks_never_mix_subjects(chunks):
    for c in chunks:
        if c.section in {"experience", "projects"}:
            assert " · " not in c.heading, c.heading


def test_entities_are_tagged(chunks):
    cupshup = [c for c in chunks if c.heading.startswith("4.1 Cupshup")]
    assert cupshup and all("cupshup" in c.entities for c in cupshup)
    blogpilot = [c for c in chunks if c.heading.startswith("5.2 BlogPilot")]
    assert blogpilot and all("blogpilot" in c.entities for c in blogpilot)


def test_cover_table_rows_are_readable(chunks):
    assert "Primary identity: AI Engineer" in chunks[0].text
