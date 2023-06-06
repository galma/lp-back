import { AppError } from "./AppError";
import { HttpStatus } from "@nestjs/common";

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, HttpStatus.BAD_REQUEST);
    this.name = "BadRequestError";
  }
}
