// src/models/Invoice.model.ts

import { Schema, model, Document, Types } from "mongoose";

export interface IInvoice extends Document {
  invoiceId: string;
  user: Types.ObjectId;
  amount: number;
  createdAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceId: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Invoice = model<IInvoice>("Invoice", invoiceSchema);
