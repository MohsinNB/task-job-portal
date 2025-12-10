// src/services/admin.service.ts
import { User } from "../models/user.model";
import { Job } from "../models/job.model";
import { Application } from "../models/application.model";
import { Invoice } from "../models/invoice.model";
import { hashPassword } from "../utils/hash";
import { Types } from "mongoose";

export const listUsers = async ({
  page = 1,
  limit = 20,
  role,
  company,
}: {
  page?: number;
  limit?: number;
  role?: string;
  company?: string;
}) => {
  const filter: any = {};
  if (role) filter.role = role;
  if (company) filter.company = company;
  const skip = (page - 1) * limit;
  const users = await User.find(filter)
    .skip(skip)
    .limit(limit)
    .select("-password")
    .lean();
  const total = await User.countDocuments(filter);
  return { users, total, page, limit };
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
  company?: string;
}) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error("Email already exists");
  const hashed = await hashPassword(data.password);
  const user = await User.create({ ...data, password: hashed });
  return user.toObject();
};

export const updateUser = async (
  id: string,
  data: Partial<{
    name: string;
    email: string;
    password: string;
    role: string;
    company?: string;
  }>
) => {
  if (data.password) data.password = await hashPassword(data.password);
  const user = await User.findByIdAndUpdate(id, data, { new: true }).select(
    "-password"
  );
  if (!user) throw new Error("User not found");
  return user;
};

export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found");
  // optional: cleanup jobs/applications/invoices tied to user
  await Job.deleteMany({ createdBy: id }).catch(() => {});
  await Application.deleteMany({ applicantId: id }).catch(() => {});
  await Invoice.deleteMany({ user: id }).catch(() => {});
  return true;
};

/** Jobs */
export const listJobs = async ({
  page = 1,
  limit = 20,
  company,
  status,
}: {
  page?: number;
  limit?: number;
  company?: string;
  status?: string;
}) => {
  const filter: any = {};
  if (company) filter.company = company;
  if (status) filter.status = status;
  const skip = (page - 1) * limit;
  const jobs = await Job.find(filter)
    .skip(skip)
    .limit(limit)
    .populate("createdBy", "name email company")
    .lean();
  const total = await Job.countDocuments(filter);
  return { jobs, total, page, limit };
};

/** Applications */
export const listApplications = async ({
  page = 1,
  limit = 20,
  company,
  status,
}: {
  page?: number;
  limit?: number;
  company?: string;
  status?: string;
}) => {
  const match: any = {};
  if (status) match.status = status;

  // if company filter provided: find jobs of that company first
  if (company) {
    const jobs = await Job.find({ company }).select("_id").lean();
    const jobIds = jobs.map((j) => j._id);
    match.jobId = { $in: jobIds };
  }

  const skip = (page - 1) * limit;
  const applications = await Application.find(match)
    .skip(skip)
    .limit(limit)
    .populate("applicantId", "name email")
    .populate("jobId", "title company")
    .lean();
  const total = await Application.countDocuments(match);
  return { applications, total, page, limit };
};

/** Basic analytics for admin dashboard */
export const getAnalytics = async () => {
  const totalUsers = await User.countDocuments();
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();
  const totalInvoices = await Invoice.countDocuments();
  const totalPaid = await Invoice.aggregate([
    { $group: { _id: null, amount: { $sum: "$amount" } } },
  ]);
  return {
    totalUsers,
    totalJobs,
    totalApplications,
    totalInvoices,
    totalPaid: totalPaid[0]?.amount ?? 0,
  };
};
