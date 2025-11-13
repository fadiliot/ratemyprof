from fastapi import APIRouter
from app.db import professors_col



router = APIRouter(prefix="/professors", tags=["Professors"])

@router.get("/")
async def get_professors():
    data = await professors.find({}, {"_id": 0}).to_list(100)
    return data





