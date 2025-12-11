import { IUser, User } from "../models/user.model";
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

export const createUser = async (data: Partial<IUser>) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error("Email already exists");
  const hashed = await hashPassword(data.password as string);
  const user = await User.create({ ...data, password: hashed });
  return user.toObject();
};

export const updateUser = async (id: string, data: Partial<IUser>) => {
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
  // cleanup jobs/applications/invoices tied to user
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
  search,
}: {
  page?: number;
  limit?: number;
  company?: string;
  status?: string;
  search?: string;
}) => {
  const filter: any = {};
  if (company) filter.company = company;
  if (status) filter.status = status; // "open" | "closed"
  if (search) {
    const re = new RegExp(search, "i");
    filter.$or = [{ title: re }, { description: re }, { company: re }];
  }

  const skip = (page - 1) * limit;
  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email company")
      .sort({ createdAt: -1 })
      .lean(),
    Job.countDocuments(filter),
  ]);

  return { jobs, total, page, limit };
};

/** Applications */
export const listApplications = async ({
  page = 1,
  limit = 20,
  company,
  status,
  search,
}: {
  page?: number;
  limit?: number;
  company?: string;
  status?: string;
  search?: string;
}) => {
  const match: any = {};

  // If admin wants to filter by application status
  if (status && ["applied", "accepted", "rejected"].includes(status)) {
    match.status = status;
  }

  // If company filter provided: restrict by jobs of that company
  if (company) {
    // fetch job ids belonging to company
    const jobIds = await Job.find({ company })
      .select("_id")
      .lean()
      .then((rows) => rows.map((r) => r._id));
    if (jobIds.length === 0) {
      // no jobs -> return empty
      return { applications: [], total: 0, page, limit };
    }
    match.jobId = { $in: jobIds };
  }

  // optional text search (applicant name or job title)
  const aggregatePipeline: any[] = [
    { $match: match },
    // join applicant and job for filtering & projection
    {
      $lookup: {
        from: "users",
        localField: "applicantId",
        foreignField: "_id",
        as: "applicant",
      },
    },
    { $unwind: "$applicant" },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    },
    { $unwind: "$job" },
  ];

  if (search) {
    const re = new RegExp(search, "i");
    aggregatePipeline.push({
      $match: {
        $or: [
          { "applicant.name": re },
          { "applicant.email": re },
          { "job.title": re },
          { "job.company": re },
        ],
      },
    });
  }

  // count and paginate
  const countPipeline = [...aggregatePipeline, { $count: "total" }];
  const dataPipeline = [
    ...aggregatePipeline,
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    // project only needed fields
    {
      $project: {
        _id: 1,
        status: 1,
        paymentStatus: 1,
        cvUrl: 1,
        createdAt: 1,
        "applicant._id": 1,
        "applicant.name": 1,
        "applicant.email": 1,
        "job._id": 1,
        "job.title": 1,
        "job.company": 1,
      },
    },
  ];

  const [countRes, applications] = await Promise.all([
    Application.aggregate(countPipeline),
    Application.aggregate(dataPipeline),
  ]);

  const total = countRes[0] && countRes[0].total ? countRes[0].total : 0;
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
