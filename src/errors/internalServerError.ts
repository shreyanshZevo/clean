import { CustomError } from "../utils/customError";

export class InternaleServerError extends CustomError {
  statusCode = 500;
  statusType = "INTERNALSERVER_ERROR";
  constructor(message: string, private property: string) {
    super(message);
    Object.setPrototypeOf(this, InternaleServerError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message, property: this.property }];
  }
}
