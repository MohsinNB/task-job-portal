// src/validations/auth.validation.ts
import { z } from "zod";
import { UserRole } from "../types/enums";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(UserRole).optional(),
    company: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});
