# Sanyark Leave Management System — Frontend

React frontend for the **Sanyark Leave Management System** technical assignment.

This application provides a modern UI for employees and managers to manage leave requests, approvals, and team calendars.

The frontend communicates with a **Spring Boot backend API** deployed on AWS Lightsail.

---

# Project Overview

The Sanyark Leave Management System allows employees to apply for leave and managers to approve or reject requests.

The system includes:

* Employee dashboard
* Leave application form
* Leave history tracking
* Manager approval panel
* Team leave calendar
* Notifications
* Holiday calendar

The UI follows a **space-themed glassmorphism design system** built with custom CSS.

---

# Tech Stack

Frontend

* React (Vite)
* React Router
* Axios
* Custom CSS design system
* Particles.js animated background

Backend (separate repository)

* Spring Boot 3
* Java 17
* JWT Authentication
* MySQL
* Flyway Migrations
* AWS Lightsail deployment

---

# Features

Employee Features

* Login with JWT authentication
* View leave balance
* Apply for leave
* View leave history
* Cancel leave requests
* Team leave calendar

Manager Features

* View all employee leave requests
* Approve or reject requests
* Add comments on decisions
* View analytics dashboard

UI Features

* Glassmorphism cards
* Animated starfield background
* Shooting star effects
* Responsive layout
* Status badges
* Interactive calendar

---

# Project Structure

```
src
│
├── api
│   └── api.js
│
├── components
│   ├── Alert.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── PageShell.jsx
│   ├── ParticlesBackground.jsx
│   ├── ProtectedRoute.jsx
│   ├── RoleProtectedRoute.jsx
│   ├── StatCard.jsx
│   └── StatusBadge.jsx
│
├── context
│   └── AuthContext.jsx
│
├── pages
│   ├── LoginPage.jsx
│   ├── EmployeeDashboardPage.jsx
│   ├── ManagerDashboardPage.jsx
│   ├── ApplyLeavePage.jsx
│   ├── MyLeavesPage.jsx
│   ├── ManagerLeavesPage.jsx
│   └── TeamCalendarPage.jsx
│
├── styles
│   └── main.css
│
├── utils
│   ├── auth.js
│   └── formatters.js
│
├── App.jsx
└── main.jsx
```

---

# Backend API

The frontend communicates with the backend using the following API endpoints:

Authentication

```
POST /api/auth/login
```

Employee

```
GET /api/dashboard/employee
POST /api/leaves
GET /api/leaves/my
PUT /api/leaves/{id}/cancel
```

Manager

```
GET /api/dashboard/manager
GET /api/manager/leaves
POST /api/manager/leave-action
```

Calendar

```
GET /api/calendar/team
GET /api/holidays
```

Notifications

```
GET /api/notifications
```

---

# Environment Configuration

Create a `.env` file in the root directory.

```
VITE_API_BASE_URL=/api
```

In production the API is proxied through **Nginx** to the backend server.

---

# Local Development

Clone the repository

```
git clone https://github.com/YOUR_USERNAME/sanyark-leave-frontend.git
```

Navigate to the project

```
cd sanyark-leave-frontend
```

Install dependencies

```
npm install
```

Start the development server

```
npm run dev
```

The application will run at

```
http://localhost:5173
```

---

# Build for Production

```
npm run build
```

This generates the production build inside the `dist` folder.

---

# Deployment

The frontend is deployed on **AWS Lightsail** using **Nginx**.

Deployment architecture

```
Nginx (port 80)
   │
   ├── React Frontend
   │
   └── Proxy /api → Spring Boot Backend (port 8080)
```

The React build is served from:

```
/var/www/sanyark-leave-frontend
```

---

# UI Design System

The UI follows a **space theme** to match the Sanyark brand.

Design elements include:

* Glassmorphism cards
* Starfield background
* Shooting star animations
* Montserrat typography
* Responsive grid layout

---

# Author

Harsh Khondalay

Frontend Developer
