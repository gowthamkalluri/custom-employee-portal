# Custom Employee Management & RBAC Portal

A full-stack employee management portal built with React.js, Node.js, Express.js, and MySQL. The application provides secure JWT authentication, role-based access control (RBAC), permission-based API authorization, employee management, leave management, and audit logging.

## Features

- JWT-based authentication
- Role-based access control
- Permission-based API authorization
- Admin, HR, Manager, and Employee roles
- Employee CRUD operations
- Leave application and approval workflow
- User management
- Role management
- Permission management
- Profile viewing and updating
- Admin dashboard with system statistics
- Audit logging for administrative activities
- Login success and failed-login audit logging
- Protected frontend routes
- Protected backend APIs
- Loading, error, and action states across the application

## Roles

| Role     | Access                               |
| -------- | ------------------------------------ |
| Admin    | Full system access                   |
| HR       | Employee, user, and leave management |
| Manager  | Employee viewing and leave approval  |
| Employee | Profile and leave management         |

## Tech Stack

### Frontend

- React.js
- Vite
- JavaScript / JSX
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- REST APIs
- JWT
- bcryptjs

### Database

- MySQL 8.0

## Application Architecture

```text
React Frontend
      │
      │ Axios / REST API
      ▼
Express.js Backend
      │
      ├── JWT Authentication
      │
      ├── Role-Based Access Control
      │
      ├── Permission Middleware
      │
      ├── Controllers
      │
      └── REST API Routes
              │
              ▼
          MySQL Database
```

## Authentication & Authorization

The application uses JWT-based authentication.

After login:

1. The backend validates the user's credentials.
2. A JWT is generated containing the user's identity and role information.
3. The frontend stores the token in local storage.
4. Axios automatically attaches the token to protected API requests.
5. Backend middleware validates the JWT.
6. Permission middleware checks whether the user's role has the required permission.
7. The API either allows or rejects the request.

Authorization is enforced on the backend rather than relying only on frontend UI visibility.

## Database Design

The application uses the following main tables:

- `users`
- `roles`
- `permissions`
- `role_permissions`
- `employees`
- `leaves`
- `audit_logs`

The `role_permissions` table maps roles to the permissions they are allowed to perform.

## Main Permissions

- `view_employees`
- `create_employee`
- `update_employee`
- `delete_employee`
- `view_leave`
- `apply_leave`
- `approve_leave`
- `view_profile`
- `update_profile`

## Leave Management

Employees can:

- Apply for leave
- Select leave type
- Specify start and end dates
- Provide a reason
- View their leave requests

Authorized users can:

- View leave requests
- Approve pending requests
- Reject pending requests

## Audit Logging

The application records important user and administrative activities.

Examples include:

- Successful login
- Failed login
- User creation
- User updates
- User deletion
- Role creation
- Role updates
- Role deletion
- Permission changes
- Other administrative actions

Audit records include information such as the user, action, resource, details, IP address, and timestamp.

## Project Structure

```text
custom-employee-portal/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MySQL 8.0
- Git

## Setup

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd custom-employee-portal
```

### 2. Configure the database

Create a MySQL database:

```sql
CREATE DATABASE custom_employee_portal;
```

Create the required tables and initial roles/permissions using the SQL setup used by the project.

### 3. Configure the backend

Navigate to the backend:

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=custom_employee_portal
JWT_SECRET=YOUR_JWT_SECRET
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 4. Configure the frontend

Open another terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Vite will provide the local frontend URL in the terminal.

## API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
PUT  /api/auth/profile
```

### Employees

```text
GET    /api/employees
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
```

### Leaves

```text
GET /api/leaves
POST /api/leaves
PUT /api/leaves/:id/status
```

### Admin

```text
GET /api/admin/stats
```

### Users

```text
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

### Roles

```text
GET    /api/roles
POST   /api/roles
PUT    /api/roles/:id
DELETE /api/roles/:id
```

### Permissions

```text
GET    /api/permissions
POST   /api/permissions
PUT    /api/permissions/:id
DELETE /api/permissions/:id
```

## Security

The project includes:

- Password hashing with bcrypt
- JWT authentication
- Protected API routes
- Permission-based authorization
- Role-based frontend navigation
- Backend authorization checks
- Automatic handling of unauthorized/expired JWT requests
- Audit logging for authentication and administrative actions

## Future Improvements

Potential future enhancements include:

- Refresh token authentication
- Password reset functionality
- Employee search and filtering
- Pagination for large datasets
- Email notifications for leave requests
- Dashboard charts and analytics
- Automated testing
- Production deployment
- Cloud database and hosting

## Author

**Gowtham Kalluri**

B.Tech Computer Science & Engineering

Built as a full-stack portfolio project demonstrating authentication, authorization, REST API development, database design, and React application development.
