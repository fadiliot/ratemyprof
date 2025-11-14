from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import professors, reviews, scraper,auth
from app.db import db

app = FastAPI(title="RateMyProfessor API")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route modules
app.include_router(auth.router, prefix="/auth", tags=["Authentication"]) 
app.include_router(professors.router, prefix="/professors", tags=["Professors"])
app.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
app.include_router(scraper.router, prefix="/scraper", tags=["Scraper"])

@app.get("/")
def root():
    return {"message": "Backend running!"}

@app.get("/test-db")
def test_db():
    try:
        stats = db.command("ping")
        return {"db_status": stats}
    except Exception as e:
        return {"error": str(e)}
