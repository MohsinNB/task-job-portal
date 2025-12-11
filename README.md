# HireME Backend System

## 📌 HireMe is a dynamic platform that connects job seekers with opportunities, enabling individuals to find employment while empowering companies to efficiently source and recruit top talent.

## A full-featured backend for HireMe-a job portal system built using:

## 🛠️ Technology Stack

```text
Node.js
Express.js
TypeScript
MongoDB + Mongoose
JWT Authentication
RBAC (Role-Based Access Control)
Multer (CV Upload)
Mock Payment System
Admin Dashboard APIs
Zod Validation
```

## 🚀 Features:

### ✅Authentication & Authorization

Register & Login (JWT)
Role-based access (jobSeeker, employee, admin)
Refresh + Access token support
Password hashing with bcrypt

### ✅Job Management

Employees(Recruiters) can create/update/delete jobs
Job Seekers can view all jobs
Admin can View all users, jobs, applications and also Filter by company or status using query params in api.

### ✅Job Applications

Job Seekers can apply to jobs
CV upload using Multer (stored locally under /uploads/cv)
Prevent duplicate applications
Employee (job owner) can:
-View applicants
-Accept/Reject applicants

Job Seekers can view their applications
Admin can view all applications and filter by company or application status

### ✅Payment System (Mock)

100 Taka required to apply for a job
Mock payment generates:
-transactionId
-amount
-timestamp

#### ✅After successful payment:

-Application is saved with status
-Invoice is generated and stored linking user → job → payment

#### ❌On payment failure:

-Application is not saved
-CV file is removed from /uploads/cv

### ✅Payment Flow:

1. Job Seeker submits POST /api/application/apply/:jobId with CV.
2. Backend performs mock payment (100 Taka).
3. If payment is successful:
   --Application is saved
   --Payment status set to paid
   --Invoice created
4. If payment fails:
   --Application is not saved
   --CV file is deleted to avoid orphan files

### ✅ Admin Panel (Backend Only)

Admins can:
-View all users, jobs, applications
-Filter jobs or applications by company or status
-Access analytics:
-Total users
-Total jobs
-Total applications
-Total revenue (mock)

### ✅Validation

All endpoints validated using Zod

## 📂Folder Structure:

```text
src/
│ app.ts
│ server.ts
│
├───app/
│ └───config/
│ ───env.ts
│
│
├── controllers/
│ admin.controller.ts
│ application.controller.ts
│ auth.controller.ts
│ job.controller.ts
│
├── middlewares/
│ auth.middleware.ts
│ multerErrorHandler.ts
│ role.middleware.ts
│ validateRequest.ts
│
├── models/
│ application.model.ts
│ invoice.model.ts
│ job.model.ts
│ user.model.ts
│
├── routes/
│ admin.route.ts
│ application.route.ts
│ auth.route.ts
│ job.routes.ts
│
├── services/
│ admin.service.ts
│ application.service.ts
│ auth.service.ts
│ job.service.ts
│
├── types/
│ enums.ts
│ express.d.ts
│
├── utils/
│ hash.ts
│ jwt.ts
│ multerLocal.ts
│ seedSuperAdmin.ts
│ setCookie.ts
│
│── validations/
│admin.validation.ts
│application.validation.ts
│auth.validations.ts
│job.validation.ts
```

### ✅Installation:

    1.Clone Repo: ```git clone https://github.com/MohsinNB/task-job-portal.git
                  cd task-job-portal```

    2.Install Dependencies:  npm install
    3. **Add environment variables:** Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongo_url

# JWT
JWT_ACCESS_SECRET=TRIPLE_FOUR
JWT_REFRESH_SECRET=JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_EXPIRES=30d

# bcrypt
BCRYPT_SALT_ROUND=10

# SUPER ADMIN
SUPER_ADMIN_EMAIL=super@gmail.com
SUPER_ADMIN_PASSWORD=your_super_Admin_Password

# Frontend url
FRONTEND_URL=http://localhost:5173
```

    4.Run Server: npm run dev

🔌API Base URL: `http://localhost:5000`

### Postman Documentation:

[![Postman Documentation](https://img.shields.io/badge/Postman-API%20Docs-orange?logo=postman)](https://documenter.getpostman.com/view/48236174/2sB3dSP8Yu)

### 📌 ERD Diagram (PDF)

You can view the ERD here:
[Open ERD](https://raw.githubusercontent.com/MohsinNB/task-job-portal/main/docs/HireME-job-portal.pdf)

#### Tables:

```text
-users
-jobs
-applications
-invoices
```

#### Relationships:

```text
-jobs.createdBy → users.\_id
-applications.jobId → jobs.\_id
-applications.applicantId → users.\_id
-invoices.user → users.\_id
```
