// src/models/Application.model.ts

import { Schema, model, Document, Types } from "mongoose";
import { ApplicationStatus, PaymentStatus } from "../types/enums";

export interface IApplication extends Document {
  jobId: Types.ObjectId;
  applicantId: Types.ObjectId;
  cvUrl: string;
  paymentStatus: PaymentStatus;
  status: ApplicationStatus;
  createdAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cvUrl: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
    },
  },
  { timestamps: true }
);

export const Application = model<IApplication>(
  "Application",
  applicationSchema
);
