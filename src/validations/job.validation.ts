import { z } from "zod";

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    requirements: z.array(z.string()).min(1),
    company: z.string().min(2),
  }),
});

export const updateJobSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    requirements: z.array(z.string()).min(1).optional(),
    company: z.string().min(2).optional(),
    status: z.enum(["open", "closed"]).optional(),
  }),
});
