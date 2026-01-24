from pymongo import MongoClient
from pymongo.database import Database
import os
from typing import Optional

client: Optional[MongoClient] = None
database: Optional[Database] = None

def getdatabase() -> Database:
    global client, database

    if database is not None:
        return database

    uri = os.getenv("MONGO_SRV")
    database_name = os.getenv("DATABASE")

    if not uri or not database_name:
        raise ValueError("MONGO_SRV and DATABASE environment variables must be set")

    try:
        client = MongoClient(uri)
        database = client.getdatabase(database_name)
        return database
    except Exception as e:
        raise Exception(f"Unable to connect to MongoDB: {e}")

def closedatabase():
    global client, database
    if client:
        client.close()
        client = None
        database = None