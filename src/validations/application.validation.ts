import { z } from "zod";

export const applyJobSchema = z.object({
  body: z.object({
    paymentMethod: z
      .enum(["mock", "sslcommerz", "stripe"])
      .optional()
      .default("mock"),
  }),
  params: z.object({
    jobId: z.string(),
  }),
});
