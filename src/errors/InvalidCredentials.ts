import { AppError } from "./AppError";
import { HttpStatus } from "@nestjs/common";

export class InvalidCredentialsError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, HttpStatus.UNAUTHORIZED);
    this.name = "InvalidCredentialsError";
  }
}
