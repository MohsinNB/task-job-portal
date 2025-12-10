import { Request, Response } from "express";
import * as service from "../services/application.service";
import { ApplicationStatus } from "../types/enums";

export const applyToJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    const fileName = req.file?.filename;
    if (!fileName) {
      return res
        .status(400)
        .json({ success: false, message: "CV is required" });
    }

    const cvUrl = `${req.protocol}://${req.get("host")}/uploads/cv/${fileName}`;

    const { application, invoice } = await service.applyToJob({
      jobId,
      applicantId: req.user!.id,
      cvUrl,
    });

    return res.status(201).json({
      success: true,
      application,
      invoice,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const getApplicants = async (req: Request, res: Response) => {
  try {
    const apps = await service.getApplicantsForJob(
      req.params.jobId,
      req.user!.id
    );
    res.json({ success: true, applicants: apps });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const acceptApplication = async (req: Request, res: Response) => {
  try {
    const updated = await service.updateApplicationStatus(
      req.params.id,
      req.user!.id,
      ApplicationStatus.ACCEPTED
    );
    res.json({ success: true, application: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const rejectApplication = async (req: Request, res: Response) => {
  try {
    const updated = await service.updateApplicationStatus(
      req.params.id,
      req.user!.id,
      ApplicationStatus.REJECTED
    );
    res.json({ success: true, application: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const myApplications = async (req: Request, res: Response) => {
  try {
    const apps = await service.getMyApplications(req.user!.id);
    res.json({ success: true, applications: apps });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const adminApplications = async (req: Request, res: Response) => {
  const apps = await service.adminApplications();
  res.json({ success: true, applications: apps });
};
