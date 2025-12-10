import { Request, Response } from "express";
import * as jobService from "../services/job.service";

export const createJob = async (req: Request, res: Response) => {
  try {
    const job = await jobService.createJob(req.body, req.user!.id);
    return res.status(201).json({ success: true, job });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await jobService.updateJob(
      req.params.id,
      req.body,
      req.user!.id
    );
    return res.json({ success: true, job });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await jobService.deleteJob(req.params.id, req.user!.id);
    return res.json({ success: true, job });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  const jobs = await jobService.getAllJobs();
  return res.json({ success: true, jobs });
};

export const getMyJobs = async (req: Request, res: Response) => {
  const jobs = await jobService.getMyJobs(req.user!.id);
  return res.json({ success: true, jobs });
};
