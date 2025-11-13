from pymongo import MongoClient
import certifi

MONGO_URI = "mongodb+srv://fa9471_db_user:RATEMYPROF@cluster0.7kaz2p5.mongodb.net/?appName=Cluster0"
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client["ratemyprof"]

print(db.command("ping"))
