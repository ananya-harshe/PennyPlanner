from pymongo import MongoClient
import os

uri = os.getenv("MONGO_SRV")
database = os.getenv("DATABASE")
client = MongoClient(uri)

try:
    database = client.get_database(database)
    
    client.close()

except Exception as e:
    raise Exception("Unable to find the document due to the following error: ", e)