import { CustomError } from "../utils/customError";

export class BadRequestError extends CustomError {
  statusCode = 400;
  statusType = "BADREQUEST_ERROR";
  constructor(message: string, private property: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message, property: this.property }];
  }
}
