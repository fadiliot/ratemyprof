from pydantic import BaseModel

class Professor(BaseModel):
    name: str
    department: str
    college: str
    profile_url: str
