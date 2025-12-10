import { Router } from "express";
import * as controller from "../controllers/application.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { applyJobSchema } from "../validations/application.validation";
import { uploadCV } from "../utils/multerLocal";
import { multerErrorHandler } from "../middlewares/multerErrorHandler";

const router = Router();

// Job Seeker: apply
router.post(
  "/apply/:jobId",
  authMiddleware,
  roleMiddleware(["jobSeeker"]),
  uploadCV.single("cv"),
  multerErrorHandler,
  validateRequest(applyJobSchema),
  controller.applyToJob
);

// Recruiter: view applicants
router.get(
  "/job/:jobId",
  authMiddleware,
  roleMiddleware(["employee"]),
  controller.getApplicants
);

// Recruiter: accept/reject
router.put(
  "/accept/:id",
  authMiddleware,
  roleMiddleware(["employee"]),
  controller.acceptApplication
);

router.put(
  "/reject/:id",
  authMiddleware,
  roleMiddleware(["employee"]),
  controller.rejectApplication
);

// Job seeker: my applications
router.get(
  "/my",
  authMiddleware,
  roleMiddleware(["jobSeeker"]),
  controller.myApplications
);

// Admin: all applications
router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.adminApplications
);

export default router;
