import os

from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from .vector_store import get_vector_store


load_dotenv()


llm = ChatGoogleGenerativeAI(
    model="gemini-3.7-flash",
    temperature=0.2,
    api_key=os.getenv("GOOGLE_API_KEY"),
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


#retriever 
def get_context(question: str):

    vector_store = get_vector_store()

    retriever = vector_store.as_retriever(
        search_kwargs={"k": 5}
    )

    documents = retriever.invoke(question)

    return "\n\n".join(
        document.page_content
        for document in documents
    )


def extract_text(content) -> str:

    # Normal string response
    if isinstance(content, str):
        return content

    # Gemini structured content
    if isinstance(content, list):

        text_parts = []

        for item in content:

            if isinstance(item, str):
                text_parts.append(item)

            elif isinstance(item, dict):

                text = item.get("text")

                if text:
                    text_parts.append(text)

        return "".join(text_parts)

    return ""


#augmentation
def ask_portfolio(question: str):

    context = get_context(question)

    messages = prompt.format_messages(
        context=context,
        question=question,
    )

    response = llm.invoke(messages)

    return extract_text(response.content)


#generation 
def stream_portfolio(question: str):

    context = get_context(question)

    messages = prompt.format_messages(
        context=context,
        question=question,
    )

    for chunk in llm.stream(messages):

        text = extract_text(chunk.content)

        if text:
            yield text