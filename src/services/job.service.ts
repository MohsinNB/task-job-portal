import { Job, IJob } from "../models/job.model";
import { Types } from "mongoose";

export const createJob = async (data: Partial<IJob>, userId: string) => {
  const job = await Job.create({
    ...data,
    createdBy: new Types.ObjectId(userId),
  });
  return job;
};

export const updateJob = async (
  jobId: string,
  data: Partial<IJob>,
  userId: string
) => {
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    data,
    { new: true }
  );
  if (!job) throw new Error("Job not found or unauthorized");
  return job;
};

export const deleteJob = async (jobId: string, userId: string) => {
  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
  if (!job) throw new Error("Job not found or unauthorized");
  return job;
};

export const getAllJobs = async () => {
  return Job.find().sort({ createdAt: -1 });
};

export const getMyJobs = async (userId: string) => {
  return Job.find({ createdBy: userId }).sort({ createdAt: -1 });
};
