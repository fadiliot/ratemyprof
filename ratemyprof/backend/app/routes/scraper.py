from fastapi import APIRouter
from app.services.scraper import scrape_professors

router = APIRouter(prefix="/scrape", tags=["Scraper"])

@router.post("/")
async def run_scraper():
    data = await scrape_professors()   # scraper already upserts into DB
    return {
        "count": len(data),
        "status": "saved_to_mongo_via_upsert"
    }
