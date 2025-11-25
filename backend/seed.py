import asyncio
from sqlalchemy import select
from app.db import AsyncSessionLocal, async_engine, Base
from app.models.user import User
from app.security import get_password_hash

async def seed_db():
    async with AsyncSessionLocal() as session:
        # Check if admin user already exists
        result = await session.execute(select(User).filter(User.username == "admin"))
        admin_user = result.scalar_one_or_none()

        if admin_user:
            print("Admin user already exists.")
            # Optionally, update password if needed, but for seeding, we usually just create if not exists
            # admin_user.hashed_password = get_password_hash("admin123")
            # await session.commit()
            # print("Admin password reset (if it changed).")
        else:
            hashed_password = get_password_hash("admin123")
            admin_user = User(
                username="admin",
                email="admin@example.com",
                full_name="Admin User",
                hashed_password=hashed_password,
                role="admin",
            )
            session.add(admin_user)
            await session.commit()
            await session.refresh(admin_user)
            print("Admin user created!")

async def init_db():
    async with async_engine.begin() as conn:
        # No need to create_all here, Alembic handles migrations
        # await conn.run_sync(Base.metadata.create_all)
        pass

if __name__ == "__main__":
    # Ensure tables are created if running seed.py directly without Alembic in dev
    # This is generally for initial setup or testing if Alembic isn't run yet.
    # For a proper workflow, Alembic should create the tables.
    # asyncio.run(init_db())
    asyncio.run(seed_db())