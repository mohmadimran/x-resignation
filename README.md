# Employee Exit Management System

A full-stack **Employee Exit Management System** built with the **MERN Stack** that streamlines the employee resignation process. Employees can submit resignation requests and complete exit questionnaires, while HR can review, approve, or reject requests through a secure dashboard.

---

## Features

### Authentication
- JWT Authentication
- Role-Based Authorization (Employee & HR)
- Secure password hashing using bcrypt
- Input validation using express-validator
- Protected API routes

### Employee Module
- Register & Login
- Submit resignation request
- Select Last Working Day (LWD)
- Answer exit interview questions
- View resignation request status
- View HR remarks after review

### HR Module
- Login
- View all resignation requests
- View employee resignation details
- Approve resignation requests
- Reject resignation requests with remarks
- Track reviewed requests

### Security
- JWT Authentication
- Password Hashing (bcrypt)
- Helmet Security Middleware
- CORS Configuration
- API Rate Limiting
- Compression Middleware
- Global Error Handling
- Request Logging using Morgan

---

# Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- Material UI
- CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator
- Helmet
- Morgan
- Compression
- CORS

---

# Project Structure

```
Exit-Management-System
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── validations
│   ├── app.js
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── hooks
│   │   ├── services
│   │   ├── context
│   │   └── routes
│   └── package.json
│
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/your-username/exit-management-system.git
```

```bash
cd exit-management-system
```

---

# Backend Setup

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
PORT=8080

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:3000

NODE_ENV=development
```

Run backend

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Start application

```bash
npm start
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|----------|---------------------|----------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |

---

## Employee APIs

| Method | Endpoint | Description |
|----------|-------------------------------|-----------------------------|
| POST | /api/employee/exit-process | Submit Exit Request |
| GET | /api/employee/my-exit | View My Exit Request |

---

## HR APIs

| Method | Endpoint | Description |
|----------|-----------------------------------------|--------------------------|
| GET | /api/hr/exit-requests | Get All Exit Requests |
| GET | /api/hr/exit-request/:id | Get Single Exit Request |
| PUT | /api/hr/exit-request/:id/approve | Approve Request |
| PUT | /api/hr/exit-request/:id/reject | Reject Request |

---

# Database Schema

## User

- Username
- Email
- Password
- Role
- Department
- Designation
- Employee ID
- Is Active

---

## Exit Process

- Employee Name
- Employee Email
- Department
- Designation
- Last Working Day
- Status
- Remarks
- Reviewed By
- Reviewed At
- Exit Responses

---

# Authentication Flow

```
Register/Login
        │
        ▼
Generate JWT Token
        │
        ▼
Store Token
        │
        ▼
Protected Routes
        │
        ▼
Verify Token
        │
        ▼
Role Authorization
        │
        ▼
Access APIs
```

---

# Exit Process Flow

```
Employee Login
        │
        ▼
Submit Resignation Request
        │
        ▼
Status = Pending
        │
        ▼
HR Reviews Request
        │
 ┌──────┴──────┐
 │             │
 ▼             ▼
Approve      Reject
 │             │
 ▼             ▼
Status      Status
Approved    Rejected
              │
              ▼
      Remarks Added
              │
              ▼
Employee Can View Status
```

---

# Future Improvements

- Email Notifications
- Employee Profile Management
- Admin Dashboard
- Search & Filter
- Pagination
- Dashboard Analytics
- File Upload Support
- Refresh Token Authentication
- HTTP-only Cookie Authentication

---

# Author

**Mohammed Imran Khan Pathan**

- MERN Stack Developer
- React.js | Node.js | Express.js | MongoDB

---

# License

This project is licensed under the MIT License.
