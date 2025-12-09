// src/models/User.model.ts

import { Schema, model, Document } from "mongoose";
import { UserRole } from "../types/enums.js";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  company?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.JOB_SEEKER,
    },
    company: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
