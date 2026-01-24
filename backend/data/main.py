from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
import os
import requests


load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    try:
        print("PennyWise backened initialized.")
    except Exception as e:
        print(f"Failed to connect to FastAPI: {e}")

@app.get("/")
async def root():
    return {"message": "PennyWise", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/settings")
def get_data():
    api_key = os.getenv("NESSIE")
    if not api_key:
        raise HTTPException(status_code=500, detail="NESSIE API Key not found in environment")

    url = f"http://api.nessieisreal.com/customers?key={api_key}"
    response = requests.get(url)
    data = response.json()

    return data