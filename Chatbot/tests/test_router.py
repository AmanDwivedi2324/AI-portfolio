from app.rag.router import route


def test_small_talk():
    assert route("Hi!").small_talk == "greeting"
    assert route("thanks").small_talk == "thanks"
    assert route("Who are you?").small_talk == "identity"
    assert route("Hi, what projects has he built?").small_talk is None


def test_entity_filter_wins_over_category():
    r = route("Explain the architecture of BlogPilot")
    assert r.entities == ["blogpilot"]
    assert r.filter == {"entities": {"$in": ["blogpilot"]}}


def test_category_filter():
    r = route("What is his CGPA?")
    assert "education" in r.categories
    assert r.filter == {"section": {"$in": r.categories}}


def test_no_filter_for_open_questions():
    assert route("Explain quantum entanglement").filter is None


def test_follow_up_reuses_previous_question():
    r = route("what stack did it use?", previous_question="Tell me about the YouTube Assistant")
    assert "YouTube Assistant" in r.retrieval_query
    assert "youtube-assistant" in r.entities


def test_new_topic_is_not_merged():
    r = route("Tell me about BlogPilot", previous_question="Tell me about the YouTube Assistant")
    assert r.retrieval_query == "Tell me about BlogPilot"
