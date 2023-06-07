import { AppError } from "./AppError";
import { HttpStatus } from "@nestjs/common";

export class ForbiddenError extends AppError {
  constructor(message = "ForbiddenError") {
    super(message, HttpStatus.FORBIDDEN);
    this.name = "ForbiddenError";
  }
}
