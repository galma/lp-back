import { AppError } from "./AppError";
import { HttpStatus } from "@nestjs/common";

export class NotEnoughBalanceError extends AppError {
  constructor(userId) {
    super(`${userId} doesn't have enought balance`, HttpStatus.FORBIDDEN);
    this.name = "NotEnoughBalanceError";
  }
}
