from pymongo import MongoClient
import certifi
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())

# Select database
db = client["ratemyprof"]

# Collections
users_col = db["users"]
professors_col = db["professors"]
reviews_col = db["reviews"]
