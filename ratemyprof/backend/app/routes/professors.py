from fastapi import APIRouter, HTTPException, Query
from app.db import professors_col

router = APIRouter(prefix="/professors", tags=["Professors"])


@router.get("/")
async def get_professors():
    data = await professors_col.find({}, {"_id": 0}).to_list(100)
    return data


@router.get("/{professor_id}")
async def get_professor(professor_id: str):
    prof = await professors_col.find_one({"_id": professor_id})
    return prof


# 🔍 NEW: search professors by name (partial, case-insensitive)
@router.get("/search/by-name")
async def search_professors_by_name(
    name: str = Query(..., min_length=1, description="Name or part of the professor's name")
):
    cursor = professors_col.find(
        {"name": {"$regex": name, "$options": "i"}},  # i = case-insensitive
        {"_id": 0}
    )
    results = await cursor.to_list(50)

    if not results:
        raise HTTPException(status_code=404, detail="No professors found matching that name")

    return results
