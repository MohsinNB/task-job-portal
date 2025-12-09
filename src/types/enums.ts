// src/types/enums.ts

export enum UserRole {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  JOB_SEEKER = "jobSeeker",
}

export enum ApplicationStatus {
  APPLIED = "applied",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export enum PaymentStatus {
  PAID = "paid",
  PENDING = "pending",
}

export enum JobStatus {
  OPEN = "open",
  CLOSED = "closed",
}
