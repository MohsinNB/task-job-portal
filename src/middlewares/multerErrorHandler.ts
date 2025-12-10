import { Request, Response, NextFunction } from "express";

export function multerErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof Error && err.message.includes("Only PDF and DOCX")) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err instanceof Error && err.message.includes("File too large")) {
    return res
      .status(400)
      .json({ success: false, message: "CV must be under 5MB" });
  }

  next(err);
}
