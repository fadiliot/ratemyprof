from fastapi import APIRouter
from app.services.scraper import scrape_professors
from app.db import professors_col  # ✅ Correct import

router = APIRouter(prefix="/scrape", tags=["Scraper"])

@router.post("/")
async def run_scraper():
    # Run scraper and insert into DB
    data = await scrape_professors()
    if data:
        professors_col.insert_many(data)
        return {"count": len(data), "status": "success"}
    return {"status": "no data found"}
