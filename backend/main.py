from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from db.pymongo import get_database


load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    try:
        db = get_database()
        # Test the connection
        db.command("ping")
        print("Connected to MongoDB")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")

@app.get("/")
async def root():
    return {"message": "PennyPlanner API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# TODO: Add your API routes here
# Example:
# @app.get("/users")
# async def get_users():
#     # Implementation here
#     pass