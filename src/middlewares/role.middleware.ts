// src/middlewares/role.middleware.ts
import { Request, Response, NextFunction } from "express";

export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: insufficient role" });
    }
    return next();
  };
}
