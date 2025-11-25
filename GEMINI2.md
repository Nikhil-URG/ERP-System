You are updating an existing full-stack project consisting of:

Backend: FastAPI, SQLAlchemy, Alembic, Pydantic v2

Frontend: React + Vite

Database: PostgreSQL

Your task is to extend the application with user authentication, admin user management, and a time-tracking system.

Make sure all code follows clean folder structure, is production-safe, and integrates smoothly with existing routes.

1. Authentication System

Implement:

Login page (frontend)

Signup page for new users

Admin default credentials seeded in DB (e.g., username: admin, password: admin123)

JWT-based auth (FastAPI fastapi.security.JWTBearer)

Password hashing (Passlib or bcrypt)

Middleware that validates JWT for protected routes

User roles:

"admin"

"user"

Admins can:

View all user accounts

Create / update / delete users

View attendance logs of any user

2. Extend Database Models

Modify / add SQLAlchemy models:

Users
id (int)
username (str)
email (str)
hashed_password (str)
role (str)  # "admin" or "user"

Attendance
id (int)
user_id (int, FK)
check_in (datetime, nullable=True)
check_out (datetime, nullable=True)
total_hours (float)


Total hours = difference between check-in and check-out.

Also create Alembic migrations.

3. Backend Endpoints

Create routes:

Authentication

POST /auth/login → returns JWT tokens

POST /auth/signup → users create their account

Admin routes (admin only)

GET /admin/users/

POST /admin/users/

PUT /admin/users/{id}

DELETE /admin/users/{id}

User routes

GET /user/me → returns user profile

GET /user/attendance/last10 → last 10 records

POST /user/attendance/check-in

POST /user/attendance/check-out

When check-in is called:

Create an attendance row

Prevent multiple active check-ins

When check-out is called:

Update the most recent open attendance entry

Compute total hours automatically

4. Frontend Implementation (React + Vite)

Create pages:

/login

Fields:

username

password
Buttons: Login, Signup (navigate to signup)

/signup

Fields:

username

email

password

All axios calls must attach JWT using interceptors.

5. User Dashboard (after login)

A screen that shows:

User info (username, email)

A single button:

If not checked in → Check In

If checked in → Check Out

Table with the last 10 check-in/check-out logs, columns:

Check-In Time | Check-Out Time | Total Hours

6. Admin Dashboard

A separate UI screen where admin can:

View all users

Create user

Delete user

Edit user role

View attendance for any user

7. Code Output Format

Gemini should output:

Updated models

Updated Pydantic schemas

Authentication utilities (JWT, hashing, dependencies)

All backend routes with correct imports

Updated Alembic migration

Frontend components with React hooks

Axios setup with JWT interceptor

Navigation updates (React Router)

8. Improve the code shutdown, right now in the terminal where I run run.sh I hit ctrl+c the terminal just gets stuck.

📌 Final Instruction

Generate all needed backend and frontend code, ensuring compatibility with FastAPI, SQLAlchemy, React, and Vite.
Refactor where necessary, but do not break existing /users/ functionality.
Make all code fully runnable.