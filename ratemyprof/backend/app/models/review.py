from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Review(BaseModel):
    professor_name: str
    rating: float = Field(..., ge=0, le=5)
    comment: str
    created_at: Optional[datetime] = datetime.now()
