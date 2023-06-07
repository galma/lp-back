import { AppError } from "./AppError";
import { HttpStatus } from "@nestjs/common";

export class UserAlreadyExistsError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, HttpStatus.BAD_REQUEST);
    this.name = "UserAlreadyExistsError";
  }
}
