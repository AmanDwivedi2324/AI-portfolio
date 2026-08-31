from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from vector_store import get_vector_store


llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    temperature=0.2,
)


prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are Aman Dwivedi's AI portfolio assistant.
Your job is to answer recruiter questions about Aman.
Use ONLY the provided portfolio context.
If the answer is not available in the context,
say that you don't have enough information.
Do not invent:
- experience
- companies
- projects
- technologies
- achievements
- metrics
- education
- responsibilities
Keep answers concise, professional and recruiter-friendly.

Portfolio context:

{context}
""",
        ),
        (
            "human",
            "{question}",
        ),
    ]
)


def ask_portfolio(question: str):
    vector_store = get_vector_store()

    retriever = vector_store.as_retriever(
        search_kwargs={
            "k": 5
        }
    )

    documents = retriever.invoke(question)

    context = "\n\n".join(
        document.page_content
        for document in documents
    )

    messages = prompt.format_messages(
        context=context,
        question=question,
    )

    response = llm.invoke(messages)

    return response.content