from fastapi import FastAPI
from dotenv import load_dotenv
import os

from .routers import users
from .db import engine, Base

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI ERP Backend!"}

app.include_router(users.router, prefix="/users", tags=["users"])
