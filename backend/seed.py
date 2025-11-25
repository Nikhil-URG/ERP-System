from app.db import SessionLocal, engine
from app.models.user import User
from app.security import get_password_hash

def seed_db():
    db = SessionLocal()
    # Check if admin user already exists
    admin_user = db.query(User).filter(User.username == "admin").first()
    if admin_user:
        admin_user.hashed_password = get_password_hash("admin123")
        db.commit()
        print("Admin password reset")
    if not admin_user:
        hashed_password = get_password_hash("admin123")
        admin_user = User(
            username="admin",
            email="admin@example.com",
            full_name="Admin User",
            hashed_password=hashed_password,
            role="admin",
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created")
    else:
        print("Admin user already exists")
    db.close()

if __name__ == "__main__":
    from app.db import Base
    Base.metadata.create_all(bind=engine)
    seed_db()
