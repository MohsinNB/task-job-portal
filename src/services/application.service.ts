import { Application } from "../models/application.model";
import { Invoice } from "../models/invoice.model";
import { Job } from "../models/job.model";
import { PaymentStatus, ApplicationStatus } from "../types/enums";
import { Types } from "mongoose";

/** Fake payment */
export const makePayment = async (userId: string, amount: number) => {
  return {
    success: true,
    transactionId: "TXN_" + Date.now(),
    amount,
    userId,
    time: new Date(),
  };
};

/** Apply to job */
export const applyToJob = async ({
  jobId,
  applicantId,
  cvUrl,
}: {
  jobId: string;
  applicantId: string;
  cvUrl: string;
}) => {
  const job = await Job.findById(jobId);
  if (!job) throw new Error("Job not found");

  // Prevent duplicate applications
  const exists = await Application.findOne({ jobId, applicantId });
  if (exists) throw new Error("Already applied to this job");

  // Payment mock
  const payment = await makePayment(applicantId, 100);

  // Create invoice
  const invoice = await Invoice.create({
    invoiceId: payment.transactionId,
    user: new Types.ObjectId(applicantId),
    amount: 100,
  });

  // Create application
  const application = await Application.create({
    jobId,
    applicantId,
    cvUrl,
    paymentStatus: PaymentStatus.PAID,
    status: ApplicationStatus.APPLIED,
  });

  return { application, invoice };
};

/** Recruiter: view applicants */
export const getApplicantsForJob = async (jobId: string, userId: string) => {
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) throw new Error("Unauthorized or job not found");

  return Application.find({ jobId }).populate("applicantId", "name email");
};

/** Recruiter: accept/reject */
export const updateApplicationStatus = async (
  applicationId: string,
  userId: string,
  status: ApplicationStatus
) => {
  const app = await Application.findById(applicationId).populate("jobId");

  if (!app) throw new Error("Application not found");
  // @ts-ignore
  if (app.jobId.createdBy.toString() !== userId)
    throw new Error("Unauthorized");

  app.status = status;
  await app.save();

  return app;
};

/** Job seeker: view my applications */
export const getMyApplications = async (userId: string) => {
  return Application.find({ applicantId: userId }).populate("jobId");
};

/** Admin: view all applications */
export const adminApplications = async () => {
  return Application.find().populate("jobId applicantId");
};
