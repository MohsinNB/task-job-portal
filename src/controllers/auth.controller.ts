import { Request, Response } from "express";
import * as authService from "../services/auth.service";
export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password, role, company } = req.body;
    const { user } = await authService.signupUser({
      name,
      email,
      password,
      role,
      company,
    });
    return res.status(201).json({
      success: true,
      user,
    });
  } catch (err: any) {
    return res
      .status(400)
      .json({ success: false, message: err.message || "Signup failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await authService.loginUser(email, password);

    // send tokens (example: send access token in body, refresh token as httpOnly cookie)
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    return res.json({
      success: true,
      user,
      accessToken: tokens.accessToken,
    });
  } catch (err: any) {
    return res
      .status(400)
      .json({ success: false, message: err.message || "Login failed" });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const tokenFromCookie =
      req.cookies?.refreshToken ??
      req.body.refreshToken ??
      req.headers["x-refresh-token"];
    if (!tokenFromCookie)
      return res
        .status(400)
        .json({ success: false, message: "No refresh token provided" });

    const tokens = await authService.refreshAccessToken(tokenFromCookie);
    // rotate cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return res.json({ success: true, accessToken: tokens.accessToken });
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      message: err.message || "Could not refresh token",
    });
  }
}

// auth.controller.ts
import { logoutUser } from "../services/auth.service";

export async function logout(req: Request, res: Response) {
  try {
    const userId = req.user?.id as string; // If you attach user during auth middleware

    await logoutUser(userId);

    // Remove refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Client must clear access token (stored in localStorage/memory)
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
}

/** protected route example */
export async function me(req: Request, res: Response) {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    return res.json({ success: true, user: req.user });
  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, message: "Could not get user" });
  }
}
