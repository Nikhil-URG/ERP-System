
# ERP System (Full-Stack Application)

A fully functional **Enterprise Resource Planning (ERP) system** built using modern web technologies. This project showcases my ability to develop and integrate a full-stack application, including user authentication, database management, and a responsive frontend.

---

Screenshots

**Login Page**

![Login Page Screenshot](Login_page.png)

**Admin Dashboard**

![Admin Dashboard Page Screenshot](Admin_dashboard.png)

**User Dashboard**

![User Dashboard Page Screenshot](User_dashboard.png)


---

## Features

- **User Authentication**: Secure login and registration with hashed passwords and JWT-based authentication.
- **Role-Based Access**: Different user roles such as Admin and regular users with access control.
- **Dashboard & Management**: Admin dashboard to manage users and system resources.
- **Data Persistence**: PostgreSQL backend with Alembic migrations for database versioning.
- **Async API**: FastAPI backend using asynchronous endpoints for high-performance operations.
- **Frontend UI**: Responsive and modern UI built with **React.js** and **Material-UI**, featuring reusable components.
- **Dockerized Setup**: Backend and database services containerized with Docker for consistent local development.

---

## Tech Stack

| Layer        | Technology                                                                 |
|-------------|----------------------------------------------------------------------------|
| Backend      | Python, FastAPI, SQLAlchemy (Async), Alembic, JWT Authentication          |
| Frontend     | React.js, Material-UI, Axios                                              |
| Database     | PostgreSQL                                                                 |
| Dev & Tools | Docker, Docker Compose, Git, pip, npm                                       |
| Environment | Python 3.12, Node.js, npm, .env for environment configuration             |

---

## Project Structure

```

ERP-System/
├── backend/             # FastAPI backend
│   ├── app/             # Application modules (models, routers, db, auth)
│   ├── alembic/         # Database migrations
│   ├── venv/            # Python virtual environment
│   └── requirements.txt
├── frontend/            # React.js frontend
│   ├── src/             # React components and pages
│   └── package.json
├── docker-compose.yml   # Docker Compose for PostgreSQL and PgAdmin
├── run.sh               # Script to run full stack locally
└── .env                 # Environment variables (DB credentials, secrets)

````

---

## Installation & Running Locally

### Prerequisites

- [Python 3.12](https://www.python.org/downloads/)
- [Node.js & npm](https://nodejs.org/)
- [Docker & Docker Compose](https://www.docker.com/)

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ERP-System.git
cd ERP-System
````

2. **Create a `.env` file** in the root directory (copy from `.env.example`) and set your environment variables:

```
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/erp_db
SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

3. **Start backend & database services**

```bash
sudo bash run.sh
```

This will:

* Start PostgreSQL and PgAdmin using Docker
* Run Alembic migrations
* Start FastAPI backend
* Start React frontend

4. **Access the application**

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend API: [http://localhost:8001](http://localhost:8001)
* PgAdmin: [http://localhost:5050](http://localhost:5050)


---

## Key Learning & Skills Demonstrated

* Full-stack web development: integration of FastAPI with React.js
* Database design, migrations, and async ORM handling
* Authentication & security best practices (password hashing, JWT)
* Docker for development environment consistency
* Modern UI development using Material-UI

---

## Future Improvements

* Add role-specific dashboards for different user types
* Reporting and analytics features for admin users
* Deploy to cloud platforms with CI/CD integration
* Unit and integration tests for backend and frontend


---

*This ERP system is a personal project demonstrating modern full-stack development skills.*

---