// src/routes/admin.routes.ts
import { Router } from "express";
import * as adminCtrl from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createUserSchema,
  updateUserSchema,
  listQuerySchema,
} from "../validations/admin.validation";

const router = Router();

// All routes protected by admin role
router.use(authMiddleware, roleMiddleware(["admin"]));

router.get("/users", validateRequest(listQuerySchema), adminCtrl.listUsers);
router.post("/users", validateRequest(createUserSchema), adminCtrl.createUser);
router.put(
  "/users/:id",
  validateRequest(updateUserSchema),
  adminCtrl.updateUser
);
router.delete("/users/:id", adminCtrl.deleteUser);

router.get("/jobs", validateRequest(listQuerySchema), adminCtrl.listJobs);
router.get(
  "/applications",
  validateRequest(listQuerySchema),
  adminCtrl.listApplications
);

router.get("/analytics", adminCtrl.analytics);

export default router;
