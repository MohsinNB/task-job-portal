import { Request, Response } from "express";
import * as adminSvc from "../services/admin.service";
import { User } from "../models/user.model";

export const listUsers = async (req: Request, res: Response) => {
  const { page = "1", limit = "20", role, company } = req.query as any;
  const data = await adminSvc.listUsers({
    page: Number(page),
    limit: Number(limit),
    role,
    company,
  });
  res.json({ success: true, ...data });
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await adminSvc.createUser(req.body);
    res.status(201).json({ success: true, user });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await adminSvc.updateUser(req.params.id, req.body);
    res.json({ success: true, user });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    await adminSvc.deleteUser(userId);
    res.json({ success: true, user: user });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const listJobs = async (req: Request, res: Response) => {
  const { page = "1", limit = "20", company, status } = req.query as any;
  const data = await adminSvc.listJobs({
    page: Number(page),
    limit: Number(limit),
    company,
    status,
  });
  res.json({ success: true, ...data });
};

export const listApplications = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "20",
    company,
    status,
    search,
  } = req.query as any;
  const data = await adminSvc.listApplications({
    page: Number(page),
    limit: Number(limit),
    company,
    status,
    search,
  });
  return res.json({ success: true, ...data });
};

export const analytics = async (req: Request, res: Response) => {
  const data = await adminSvc.getAnalytics();
  res.json({ success: true, data });
};
