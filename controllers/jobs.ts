import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Job from '../models/Job';
import { BadRequestError, NotFoundError } from '../errors';

const getAllJobs = async (req: Request, res: Response) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req: Request, res: Response) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.find({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`Nie znaleziono pracy o tym id: ${jobId}`);
  }
  res.status(StatusCodes.CREATED).json({ job });
};

const createJob = async (req: Request, res: Response) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req: Request, res: Response) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;
  if (company === '' || position === '') {
    throw new BadRequestError('Pozycja lub firma nie została znaleziona');
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`Nie znaleziono pracy o tym id: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req: Request, res: Response) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`Nie znaleziono pracy o tym id: ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
};

export { getAllJobs, getJob, createJob, updateJob, deleteJob };
