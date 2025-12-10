import { Router } from "express";
import { uploadCV } from "../utils/multerLocal";
import { multerErrorHandler } from "../middlewares/multerErrorHandler";
import { uploadCVController } from "../controllers/upload.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

router.post(
  "/cv",
  authMiddleware,
  roleMiddleware(["jobSeeker"]),
  uploadCV.single("cv"),
  multerErrorHandler,
  uploadCVController
);

export default router;
