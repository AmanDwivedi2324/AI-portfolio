from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router

app = FastAPI(
    title="Aman AI Portfolio",
    description="AI assistant for Aman Dwivedi",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
         "http://localhost:5173",
    "http://localhost:3000",
    "https://aman-ai-portfolio-backend.onrender.com/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(chat_router)

@app.get("/")
def root():
    return {
        "status":"healthy"
    }