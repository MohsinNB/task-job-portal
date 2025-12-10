import { User, IUser } from "../models/user.model";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { hashPassword, comparePassword } from "../utils/hash";
import { Types } from "mongoose";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Signup new user
 */
export async function signupUser(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
  company?: string;
}): Promise<{ user: IUser }> {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new Error("User already exists");

  const hashed = await hashPassword(data.password);
  const user = new User({
    name: data.name,
    email: data.email,
    password: hashed,
    role: data.role ?? "jobSeeker",
    company: data.company,
  });

  await user.save();
  return { user };
}

/**
 * Login user: returns tokens
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: IUser; tokens: AuthTokens }> {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const ok = await comparePassword(password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });

  // Optionally store refresh token in DB (recommended) - for simplicity we won't store now.
  return { user, tokens: { accessToken, refreshToken } };
}

/**
 * Exchange refresh token for new access token (and optionally new refresh token)
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<AuthTokens> {
  try {
    const payload = verifyRefreshToken<{ userId: string }>(refreshToken);
    const userId = payload.userId;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const accessToken = signAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });
    const newRefreshToken = signRefreshToken({ userId: user._id.toString() });
    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
}

/**
 * Optional: logout - if storing refresh tokens server-side, remove it.
 * For stateless approach, client just deletes the refresh token cookie/local storage.
 */
export async function logoutUser(userId: Types.ObjectId | string) {
  // If you persist refresh tokens, delete them here.
  return;
}
