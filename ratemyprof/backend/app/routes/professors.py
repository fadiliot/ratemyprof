from fastapi import APIRouter
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
