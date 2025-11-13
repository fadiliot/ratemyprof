import asyncio
from app.services.scraper import scrape_professors

if __name__ == "__main__":
    asyncio.run(scrape_professors("13519"))
