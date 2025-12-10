import { Router } from "express";
import * as jobController from "../controllers/job.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createJobSchema,
  updateJobSchema,
} from "../validations/job.validation";

const router = Router();

// Public
router.get("/all-jobs", jobController.getAllJobs);

// Employee Only
router.post(
  "/create-job",
  authMiddleware,
  roleMiddleware(["employee"]),
  validateRequest(createJobSchema),
  jobController.createJob
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["employee"]),
  validateRequest(updateJobSchema),
  jobController.updateJob
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["employee"]),
  jobController.deleteJob
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware(["employee"]),
  jobController.getMyJobs
);

export default router;
