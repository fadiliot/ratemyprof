# app/routes/reviews.py
from fastapi import APIRouter, HTTPException
from app.db import reviews_col

router = APIRouter()

@router.get("/", summary="List all reviews")
async def list_reviews(limit: int = 100):
    docs = await reviews_col.find().to_list(limit)
    return docs

@router.post("/", summary="Add a new review")
async def add_review(review: dict):
    result = await reviews_col.insert_one(review)
    return {"_id": str(result.inserted_id)}

@router.get("/{prof_name}", summary="Get reviews for professor")
async def get_reviews_by_professor(prof_name: str):
    docs = await reviews_col.find({"professor_name": prof_name}).to_list(100)
    if not docs:
        raise HTTPException(status_code=404, detail="No reviews found for this professor")
    return docs
