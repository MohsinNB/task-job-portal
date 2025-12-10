import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

// MAX 5 MB
const MAX_SIZE = 5 * 1024 * 1024;

// Storage: save files in /uploads/cv
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/cv");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Allowed types
const allowedFileTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// File filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!allowedFileTypes.includes(file.mimetype)) {
    return cb(new Error("Only PDF and DOCX files are allowed"));
  }
  cb(null, true);
};

// Final uploader
export const uploadCV = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE,
  },
});
