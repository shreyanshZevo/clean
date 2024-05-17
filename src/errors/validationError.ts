import { CustomError } from "../utils/customError";

export class ValidationError extends CustomError {
  statusCode = 400;
  statusType = "VALIDATION_ERROR";
  constructor(message: string, private property: string) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message, property: this.property }];
  }
}
