// src/models/Job.model.ts

import { Schema, model, Document, Types } from "mongoose";
import { JobStatus } from "../types/enums.js";

export interface IJob extends Document {
  title: string;
  description: string;
  requirements: string[];
  company: string;
  createdBy: Types.ObjectId;
  status: JobStatus;
  createdAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String, required: true }],
    company: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.OPEN,
    },
  },
  { timestamps: true }
);

export const Job = model<IJob>("Job", jobSchema);
