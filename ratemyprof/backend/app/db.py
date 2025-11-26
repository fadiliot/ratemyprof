import os
from motor.motor_asyncio import AsyncIOMotorClient
import certifi
from dotenv import load_dotenv  # make sure python-dotenv is installed

# Load variables from .env
load_dotenv()

# Read from environment (with fallback just in case)
MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb+srv://fa9471_db_user:RATEMYPROF@cluster0.7kaz2p5.mongodb.net/?retryWrites=true&w=majority",
)
DB_NAME = os.getenv("DB_NAME", "ratemyprof")

# Use certifi CA bundle for TLS with Atlas (recommended)
client = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where())

# Database and collections
db = client[DB_NAME]

professors_col = db["professors"]
reviews_col = db["reviews"]
users_col = db["users"]
ratings_col = db["ratings"]
