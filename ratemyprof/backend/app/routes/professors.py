# app/routes/professors.py

from fastapi import APIRouter, HTTPException, Query
from app.db import professors_col, ratings_col

router = APIRouter(prefix="/professors", tags=["Professors"])


# ⭐ Helper: compute rating stats for a professor (by profile_url)
async def aggregate_rating_stats(profile_url: str):
    pipeline = [
        {"$match": {"professor_profile_url": profile_url}},
        {
            "$group": {
                "_id": None,
                "avg_teaching_clarity": {"$avg": "$teaching_clarity"},
                "avg_communication": {"$avg": "$communication"},
                "avg_fairness": {"$avg": "$fairness"},
                "avg_engagement": {"$avg": "$engagement"},
                "rating_count": {"$sum": 1}
            }
        }
    ]

    agg = await ratings_col.aggregate(pipeline).to_list(1)

    if not agg:
        return {
            "avg_teaching_clarity": 0,
            "avg_communication": 0,
            "avg_fairness": 0,
            "avg_engagement": 0,
            "avg_rating": 0,
            "rating_count": 0,
        }

    row = agg[0]

    overall = (
        row["avg_teaching_clarity"]
        + row["avg_communication"]
        + row["avg_fairness"]
        + row["avg_engagement"]
    ) / 4

    row["avg_rating"] = overall
    return row


# ⭐ GET ALL PROFESSORS — WITH RATING STATS
@router.get("/")
async def get_professors():
    docs = [doc async for doc in professors_col.find({}, {"_id": 0})]

    out = []
    for prof in docs:
        profile_url = prof.get("profile_url")
        stats = await aggregate_rating_stats(profile_url)
        out.append({**prof, **stats})

    return out


# ⭐ GET PROFESSOR BY PROFILE_URL (id = profile_url)
@router.get("/{profile_url}")
async def get_professor(profile_url: str):
    prof = await professors_col.find_one({"profile_url": profile_url}, {"_id": 0})
    if not prof:
        raise HTTPException(status_code=404, detail="Professor not found")

    stats = await aggregate_rating_stats(profile_url)
    return {**prof, **stats}


# ⭐ SEARCH PROFESSORS BY NAME — WITH RATING STATS
@router.get("/search/by-name")
async def search_professors_by_name(
    name: str = Query(..., min_length=1)
):
    cursor = professors_col.find(
        {"name": {"$regex": name, "$options": "i"}},
        {"_id": 0}
    )

    results = await cursor.to_list(50)
    if not results:
        raise HTTPException(404, "No professors found matching that name")

    out = []
    for prof in results:
        profile_url = prof.get("profile_url")
        stats = await aggregate_rating_stats(profile_url)
        out.append({**prof, **stats})

    return out
