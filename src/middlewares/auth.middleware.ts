// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .json({ success: false, message: "Authorization header missing" });

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer")
      return res
        .status(401)
        .json({ success: false, message: "Invalid Authorization header" });

    const token = parts[1];
    const payload = verifyAccessToken<{ userId: string; role: string }>(
      token as string
    );
    req.user = { id: payload.userId, role: payload.role };
    console.log(req.user);
    return next();
  } catch (err: any) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}
