# TaskFlow - Project Management Dashboard

TaskFlow is a secure, role-based task and project management web application built with Next.js. It allows teams to organize projects, assign tasks, and track progress in real-time.

## 🚀 Live Demo
**Live URL:** https://taskflow-app-production-b300.up.railway.app/

## ✨ Features
* **Secure Authentication:** Custom Signup and Login flow using NextAuth.js (Credentials Provider) and bcrypt password hashing.
* **Role-Based Access Control (RBAC):** Users are assigned either an `ADMIN` or `MEMBER` role, which dictates what they can see and do within the app.
* **Project Management:** Admins can create and manage new projects.
* **Task Management:** Admins can create tasks and assign them to specific projects. 
* **Interactive Status Tracking:** Users can seamlessly update task statuses (`TODO`, `IN_PROGRESS`, `DONE`) directly from the dashboard using an interactive UI.
* **Admin Team Panel:** A dedicated, protected route for Admins to view all registered users and safely promote or demote their roles.

## 🛠️ Tech Stack
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Database:** PostgreSQL (Hosted on Railway)
* **ORM:** Prisma
* **Authentication:** NextAuth.js

## 💻 Local Development Setup

To run this project locally on your machine, follow these steps:

**1. Clone the repository**
```bash
git clone https://github.com/krunalsahare14-cell/taskflow-app.git
cd taskflow
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up your Environment Variables**
Create a `.env` file in the root of your project and add the following:
```env
# Your PostgreSQL Database URL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-development-secret-key"
```

**4. Push the database schema**
Run Prisma to generate your local database tables:
```bash
npx prisma db push
npx prisma generate
```

**5. Start the development server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the live result.

## 🚢 Deployment Notes
This project is configured for seamless deployment on **Railway**. Ensure that the `PORT`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and `DATABASE_URL` are properly set in your Railway project variables. Note: `NEXTAUTH_URL` must exactly match your live production URL (e.g., `https://your-app.up.railway.app`).

---
*Created as part of a full-stack web development assignment.*