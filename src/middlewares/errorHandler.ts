import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //error handling logic here
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ dto: err.serializeErrors() });
  }

  // Generic error response for other unhandled errors
  //res.status(500).json({ error: 'Internal Server Error' });
  res.status(400).send({
    dto: [{ message: "Something went wrong" }],
  });
};
