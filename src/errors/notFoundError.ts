import { CustomError } from "../utils/customError";

export class NotFoundError extends CustomError {
  statusCode = 404;
  statusType = "NOTFOUND_ERROR";
  constructor(message: string, private property: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message, property: this.property }];
  }
}
