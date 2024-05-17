import { CustomError } from "../utils/customError";

export class AuthenticationError extends CustomError {
  statusCode = 401;
  statusType = "AUTHENTICATION_ERROR";
  constructor(message: string, private property: string) {
    super(message);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message, property: this.property }];
  }
}
