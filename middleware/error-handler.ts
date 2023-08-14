import { NextFunction, Request, Response } from 'express';
// import { CustomAPIError } from '../errors';
import { StatusCodes } from 'http-status-codes';
import { Error } from 'mongoose';
const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Coś poszło nie tak, spróbuj ponownie później',
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  if (err.name === 'ValidationError') {
    console.log('object');
    customError.msg = Object.values(err.errors)
      .map(item => item.message)
      .join(' ,');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === 'CastError') {
    customError.msg = `brak wartości o id: ${err.value}`;

    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Zdublikowana wartość dla wartości: ${Object.keys(
      err.keyValue
    )}, prosze spróbować z inną wartoscią`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export = errorHandlerMiddleware;
