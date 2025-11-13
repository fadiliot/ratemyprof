from pymongo import MongoClient
import certifi

# MongoDB Atlas connection
MONGO_URI = "mongodb+srv://fa9471_db_user:RATEMYPROF@cluster0.7kaz2p5.mongodb.net/?appName=Cluster0"
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())

# Database and collections
db = client["ratemyprof"]
professors_col = db["professors"]
reviews_col = db["reviews"]
