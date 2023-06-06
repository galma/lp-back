import { AppError } from "./AppError";
import { HttpStatus } from "@nestjs/common";

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, HttpStatus.NOT_FOUND);
    this.name = "NotFoundError";
  }
}
