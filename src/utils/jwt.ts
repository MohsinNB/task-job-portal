// src/utils/jwt.ts
import jwt, { SignOptions } from "jsonwebtoken";
import { envVars } from "../app/config/env.js";

export interface AccessTokenPayload {
  userId: string;
  role: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

/** create access token */
export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: envVars.JWT_ACCESS_EXPIRES,
  } as SignOptions);
}

/** create refresh token */
export function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, envVars.JWT_REFRESH_SECRET, {
    expiresIn: envVars.JWT_REFRESH_EXPIRES,
  } as SignOptions);
}

/** verify access token, throws on invalid */
export function verifyAccessToken<T = AccessTokenPayload>(token: string): T {
  return jwt.verify(token, envVars.JWT_ACCESS_SECRET) as T;
}

/** verify refresh token, throws on invalid */
export function verifyRefreshToken<T = RefreshTokenPayload>(token: string): T {
  return jwt.verify(token, envVars.JWT_REFRESH_SECRET) as T;
}
