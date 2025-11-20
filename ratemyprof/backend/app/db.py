from motor.motor_asyncio import AsyncIOMotorClient
import certifi

# MongoDB Atlas connection
MONGO_URI = "mongodb+srv://fa9471_db_user:RATEMYPROF@cluster0.7kaz2p5.mongodb.net/?appName=Cluster0"
client = AsyncIOMotorClient(MONGO_URI)

# Database and collections
db = client["ratemyprof"]
professors_col = db["professors"]
reviews_col = db["reviews"]
