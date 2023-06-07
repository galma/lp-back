import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Injectable,
  HttpException,
} from "@nestjs/common";
import * as httpStatus from "http-status";
import { SchemaValidationError } from "../../src/errors/SchemaValidationFailed";
import { AppError } from "../../src/errors/AppError";
import { LoggerService } from "./logger.service";

@Injectable()
@Catch()
export class HttpExceptionHandlerFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: Error, host: ArgumentsHost) {
    console.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let error;
    let res;

    if (exception instanceof SchemaValidationError) {
      error = exception;
      res = {
        statusCode: error.status,
        message: error.message,
        failedValidations: error.failedValidations,
        errorType: error.name,
      };
    } else if (!(exception instanceof AppError)) {
      if (exception instanceof HttpException) {
        error = exception;
        if (error?.response) {
          res = {
            ...error.response,
            errorType: error.name,
          };
        }
      } else {
        error = new AppError(
          exception.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
          exception.stack
        );

        this.logger.error("UnhandledError", [exception]);
      }
    } else {
      error = exception as AppError;
    }
    const status = error.getStatus();
    if (!res) {
      res = {
        statusCode: status,
        errorType: error.name,
        error: httpStatus[status],
        message: error.message,
        ...(error.data && { data: error.data }),
      };
    }
    response.status(status).send(res);
  }
}
