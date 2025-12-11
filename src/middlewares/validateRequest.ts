import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      // 🚨 CHECK IF THE ERROR IS A ZOD ERROR 🚨
      if (error instanceof ZodError) {
        // Use .flatten() to simplify the error output
        const formattedErrors = error.flatten();

        return res.status(400).json({
          success: false,
          message: "Validation failed.", // A simple, general error message
          // errors will now contain a clean object of messages
          errors: formattedErrors.fieldErrors,
        });
      }

      // Handle other types of errors (e.g., internal server errors)
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred.",
      });
    }
  };
};
