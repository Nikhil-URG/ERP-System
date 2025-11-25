from httpx import AsyncClient
from app.main import app
from app.db import get_db, Base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import pytest
import asyncio
import os

# Use a separate test database URL
TEST_DATABASE_URL = "postgresql+asyncpg://erp_user:erp_password@localhost:5432/erp_test_db"

async_engine_test = create_async_engine(TEST_DATABASE_URL, echo=True)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=async_engine_test, class_=AsyncSession)

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session", autouse=True)
async def setup_test_db():
    async with async_engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with async_engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def db_session():
    async with TestingSessionLocal() as session:
        yield session

@pytest.fixture
async def client_override_db(db_session: AsyncSession):
    app.dependency_overrides[get_db] = lambda: db_session
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_create_user(client_override_db: AsyncClient):
    response = await client_override_db.post(
        "/users/",
        json={"username": "testuser", "email": "test@example.com", "full_name": "Test User", "password": "securepassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert data["role"] == "user"
    assert "hashed_password" not in data # Ensure hashed_password is not returned

@pytest.mark.asyncio
async def test_read_users(client_override_db: AsyncClient):
    response = await client_override_db.get("/users/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_read_user(client_override_db: AsyncClient):
    # First create a user
    await client_override_db.post(
        "/users/",
        json={"username": "testuser2", "email": "test2@example.com", "full_name": "Test User 2", "password": "securepassword2"},
    )
    
    response = await client_override_db.get("/users/1") # Assuming ID 1 for the first user
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test2@example.com"
    assert data["username"] == "testuser2"
