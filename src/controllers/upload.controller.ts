import { Request, Response } from "express";

export const uploadCVController = (req: Request, res: Response) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  const filePath = req.file.path; // example: uploads/cv/cv-12345.pdf

  return res.json({
    success: true,
    message: "File uploaded successfully",
    cvUrl: filePath,
  });
};
