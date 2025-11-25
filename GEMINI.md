You are my software engineer assistant. 
Your task is to generate a complete local development setup for an ERP-style portfolio project using:

- Backend: Python FastAPI
- Frontend: React with Vite
- Database: PostgreSQL running ONLY in Docker (no local installation)
- Tooling: Alembic for migrations
- Testing: pytest (backend) + vitest (frontend)
- Environment: I run everything through gemini-cli and "vibe" coding.

### Your output MUST include and complete the following:

1. Create a clear file/folder structure for:
   - backend/
   - frontend/
   - db/ (optional for SQL init)
   - docker/ (if needed later)

2. Write the entire docker-compose.yml that contains ONLY:
   - Postgres 15 (with exposed ports and user/pass/db)
   - pgAdmin (optional but useful)
   Do NOT containerize backend or frontend yet — only PostgreSQL for local development.

3. Write the `.env` file the backend will need and explain where to place it.

4. Generate the FastAPI backend starter code including:
   - app/main.py
   - app/db.py (SQLAlchemy session)
   - app/models/ (example User model)
   - app/routers/ (example CRUD routes)
   - alembic.ini and Alembic folder with correct env.py configuration
   - A sample migration script

5. Write the Vite + React frontend starter including:
   - `src/api/client.js` pointing to the backend URL
   - A sample page that fetches users and displays them

6. Write script that does:
   - starting Postgres using docker compose
   - running backend
   - running alembic migrations
   - running frontend
   - verifying that everything works

7. Include test examples:
   - pytest example for FastAPI route
   - vitest example for frontend API function

8. Provide instructions to verify the entire pipeline end-to-end:
   - Start Postgres container
   - Run migration
   - Start backend
   - Start frontend
   - Call API
   - Confirm UI displays results

9. IMPORTANT: Prevent looping.
   At the end of your answer, write:
   === END ===
   After writing this, STOP and do NOT continue.

10. Add logs at important points to make debugging easier.

Follow all steps precisely and produce fully working code that I can copy-paste into my project.
