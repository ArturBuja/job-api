import { NextFunction, Request, Response } from 'express';
import User = require('../models/User');
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';

const register = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.create({ ...req.body });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Proszę wprowadzić nazwę i hasło');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('Nieprawidłowe dane');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Nieprawidłowe dane');
  }
  //compare pwd
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ token, user: { name: user.name } });
};

export { register, login };
