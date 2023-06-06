import { HttpException } from "@nestjs/common";

export class AppError extends HttpException {
  data?: unknown;
  constructor(message: string, status: number, stack?: string, data?: unknown) {
    super(message, status);
    this.name = this.constructor.name;
    this.message = message;
    this.data = data;
  }
}
