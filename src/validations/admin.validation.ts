// src/validations/admin.validation.ts
import { z } from "zod";
import { UserRole } from "../types/enums";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.nativeEnum(UserRole),
    company: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.nativeEnum(UserRole).optional(),
    company: z.string().optional(),
  }),
});

export const listQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    company: z.string().optional(),
    role: z.string().optional(),
    status: z.string().optional(), // for applications/jobs filtering
  }),
});
