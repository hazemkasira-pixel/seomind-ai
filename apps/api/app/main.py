from fastapi import FastAPI

from app.db.session import Base
from app.db.session import engine

import app.models.user
import app.models.article

from app.api.auth import router as auth_router
from app.api.articles import router as articles_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SEOMind AI",
    version="0.1.0",
)

app.include_router(auth_router)
app.include_router(articles_router)


@app.get("/")
async def root():
    return {
        "app": "SEOMind AI",
        "status": "running",
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
    }