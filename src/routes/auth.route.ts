import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema, signupSchema } from "../validations/auth.validations";

const router = Router();

/** Public */
router.post("/signup", validateRequest(signupSchema), authController.signup);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authMiddleware, authController.logout);

/** Protected example */
router.get("/me", authMiddleware, authController.me);

export default router;
