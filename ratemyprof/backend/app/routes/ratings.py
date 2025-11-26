# app/routes/ratings.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

from app.utils.deps import get_current_user
from app.db import ratings_col  # professors_col no longer needed for lookups

router = APIRouter(prefix="/ratings", tags=["Ratings"])


# 🧾 Input model for a rating
class RatingIn(BaseModel):
    professor_name: str
    professor_profile_url: str
    teaching_clarity: int = Field(..., ge=1, le=5)
    communication: int = Field(..., ge=1, le=5)
    fairness: int = Field(..., ge=1, le=5)
    engagement: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None  # optional comment


# 🔍 Output model (for listing ratings)
class RatingOut(BaseModel):
    professor_name: str
    professor_profile_url: str
    teaching_clarity: int
    communication: int
    fairness: int
    engagement: int
    overall_score: float
    user_email: str
    comment: str
    created_at: datetime


async def compute_professor_stats(professor_profile_url: str) -> Optional[dict]:
    """
    Compute aggregate stats for a professor based on ratings:
      - avg_teaching_clarity
      - avg_communication
      - avg_fairness
      - avg_engagement
      - avg_rating (overall)
      - rating_count

    Currently just returns the stats (doesn't update any professors collection).
    """

    pipeline = [
        {"$match": {"professor_profile_url": professor_profile_url}},
        {
            "$group": {
                "_id": "$professor_profile_url",
                "avg_teaching_clarity": {"$avg": "$teaching_clarity"},
                "avg_communication": {"$avg": "$communication"},
                "avg_fairness": {"$avg": "$fairness"},
                "avg_engagement": {"$avg": "$engagement"},
                "rating_count": {"$sum": 1},
            }
        },
    ]

    agg = await ratings_col.aggregate(pipeline).to_list(1)
    if not agg:
        return None

    stats = agg[0]
    overall = (
        stats["avg_teaching_clarity"]
        + stats["avg_communication"]
        + stats["avg_fairness"]
        + stats["avg_engagement"]
    ) / 4.0

    stats["avg_rating"] = overall
    return stats


@router.post("/", status_code=201)
async def create_rating(rating: RatingIn, user=Depends(get_current_user)):
    user_email = user["email"]

    # 1. Enforce one rating per user per professor (by profile_url)
    existing = await ratings_col.find_one(
        {
            "professor_profile_url": rating.professor_profile_url,
            "user_email": user_email,
        }
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You have already rated this professor",
        )

    # 2. Compute overall score for this single rating
    overall_score = (
        rating.teaching_clarity
        + rating.communication
        + rating.fairness
        + rating.engagement
    ) / 4.0

    # 3. Insert rating doc
    await ratings_col.insert_one(
        {
            "professor_name": rating.professor_name,
            "professor_profile_url": rating.professor_profile_url,
            "user_email": user_email,
            "teaching_clarity": rating.teaching_clarity,
            "communication": rating.communication,
            "fairness": rating.fairness,
            "engagement": rating.engagement,
            "overall_score": overall_score,
            "comment": rating.comment or "",
            "created_at": datetime.utcnow(),
        }
    )

    # 4. (Optional) compute stats if you want to show them somewhere
    stats = await compute_professor_stats(rating.professor_profile_url)

    return {
        "message": "Rating submitted",
        "stats": stats,
    }


@router.get("/professor/{professor_profile_url}", response_model=List[RatingOut])
async def get_ratings_for_professor(professor_profile_url: str):
    docs = await ratings_col.find(
        {"professor_profile_url": professor_profile_url},
        {"_id": 0},
    ).to_list(200)

    if not docs:
        # No ratings yet is fine; return empty list
        return []

    return docs
