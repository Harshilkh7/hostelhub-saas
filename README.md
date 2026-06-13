# HostelHub SaaS

A full-stack hostel management platform built for managing hostel operations such as room allocation, leave requests, and complaint tracking. The platform supports role-based access control for administrators and students.

## Live Demo

Frontend: https://hostelhub-saas.vercel.app

Backend: https://hostelhub-saas.onrender.com

---

## Features

### Authentication & Authorization

* JWT-based authentication
* Secure login and registration
* Role-Based Access Control (RBAC)
* Protected routes on both frontend and backend

### Admin Features

* Dashboard with hostel statistics
* Create and manage hostels
* Create and manage rooms
* View all leave requests
* Approve or reject leave requests
* View all complaints
* Update complaint status (OPEN → IN_PROGRESS → RESOLVED)

### Student Features

* Student dashboard
* Apply for leave
* Track leave request status
* Submit complaints
* Track complaint resolution status

---

## Tech Stack

### Frontend

* React
* React Router
* Axios
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt

### Database

* PostgreSQL
* Supabase

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: Supabase

---

## System Architecture

Frontend (React + Vercel)

↓

Backend API (Node.js + Express + Render)

↓

PostgreSQL Database (Supabase)

---

## Database Design

### Users

| Field    | Type   |
| -------- | ------ |
| id       | UUID   |
| name     | String |
| email    | String |
| password | String |
| role     | ENUM   |

### Hostels

| Field   | Type   |
| ------- | ------ |
| id      | UUID   |
| name    | String |
| address | String |

### Rooms

| Field       | Type    |
| ----------- | ------- |
| id          | UUID    |
| hostel_id   | UUID    |
| room_number | String  |
| floor       | Integer |
| capacity    | Integer |

### Leave Requests

| Field      | Type |
| ---------- | ---- |
| id         | UUID |
| student_id | UUID |
| reason     | Text |
| from_date  | Date |
| to_date    | Date |
| status     | ENUM |

### Complaints

| Field       | Type   |
| ----------- | ------ |
| id          | UUID   |
| student_id  | UUID   |
| title       | String |
| description | Text   |
| status      | ENUM   |

---

## API Endpoints

### Authentication

POST /api/auth/register

POST /api/auth/login

### Hostels

GET /api/hostels

POST /api/hostels

### Rooms

GET /api/rooms

POST /api/rooms

### Leave Requests

POST /api/leaves

GET /api/leaves

GET /api/leaves/my

PATCH /api/leaves/:id

### Complaints

POST /api/complaints

GET /api/complaints

GET /api/complaints/my

PATCH /api/complaints/:id

### Dashboard

GET /api/dashboard/stats

---

## Local Setup

### Clone Repository

```bash
git clone https://github.com/Harshilkh7/hostelhub-saas.git
cd hostelhub-saas
```

### Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000

DATABASE_URL=your_database_url

JWT_SECRET=your_secret
```

Run backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Screenshots

### Login Page

<img width="855" height="471" alt="image" src="https://github.com/user-attachments/assets/153d8fee-2897-476e-af37-c52256121b50" />


### Admin Dashboard

<img width="1901" height="877" alt="image" src="https://github.com/user-attachments/assets/408cf99a-ffb5-4c74-bfbb-ed3cf5f477eb" />


### Hostel Management

<img width="1898" height="915" alt="image" src="https://github.com/user-attachments/assets/b031427c-a475-4294-91cb-f22fe5bb800a" />


### Room Management

<img width="1919" height="901" alt="image" src="https://github.com/user-attachments/assets/26aae23b-f3d1-41cb-9bba-3f490a448c6f" />


### Leave Management

<img width="1913" height="914" alt="image" src="https://github.com/user-attachments/assets/4a229b3a-b988-4396-831c-eb7c76085cd0" />


### Complaint Management

<img width="1913" height="914" alt="image" src="https://github.com/user-attachments/assets/37a12889-aa6b-4c6f-b9c0-167710593d83" />


---

## Key Learnings

* JWT Authentication and Authorization
* Role-Based Access Control (RBAC)
* REST API Design
* PostgreSQL Relational Database Modeling
* React State Management
* Frontend and Backend Integration
* Deployment using Vercel and Render
* CORS Configuration and Production Debugging

---

## Future Improvements

* Room allocation system
* Visitor management
* Email notifications
* Student profile management
* Analytics dashboard
* Multi-hostel support
* Mobile responsive UI improvements

---

## Author

Harshil Khandelwal

GitHub: https://github.com/Harshilkh7
