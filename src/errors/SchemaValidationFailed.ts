import { AppError } from "./AppError";
import { HttpStatus } from "@nestjs/common";

export class SchemaValidationError extends AppError {
  failedValidations: ItemValidationError[];
  constructor(
    failedValidations: ItemValidationError[],
    message = "Schema Validation Failed (Bad Request)"
  ) {
    super(message, HttpStatus.BAD_REQUEST);
    this.name = "SchemaValidationError";
    this.failedValidations = failedValidations;
  }
}

export class ItemValidationError {
  property: string;
  parent: string;
  message: string;
  constructor(property: string, parent: string, message: string) {
    this.property = property;
    this.parent = parent;
    this.message = message;
  }
}
