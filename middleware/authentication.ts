import User from '../models/User';
import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors';
import { NextFunction, Request, Response } from 'express';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  //check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Brak autoryzacji');
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // ATTACH THE USER TO THE JOB ROUTERS
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Brak autoryzacji');
  }
};

export = auth;
