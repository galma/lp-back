import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Injectable,
  HttpException,
} from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import * as httpStatus from 'http-status'
import { AppError } from './AppError'
import { Logger, LoggerSrv } from '../logger'
import { SchemaValidationError } from './SchemaValidationFailed'

@Injectable()
@Catch()
export class HttpExceptionHandlerFilter implements ExceptionFilter {
  constructor(@Logger('ExceptionHandler') private logger: LoggerSrv) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()
    let error
    let res

    if (exception instanceof SchemaValidationError) {
      error = exception
      res = {
        statusCode: error.status,
        message: error.message,
        failedValidations: error.failedValidations,
        errorType: error.name,
      }
    } else if (!(exception instanceof AppError)) {
      if (exception instanceof HttpException) {
        error = exception
        if (error?.response) {
          res = {
            ...error.response,
            errorType: error.name,
          }
        }
      } else {
        error = new AppError(
          exception.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
          exception.stack
        )
        this.logger.error('UnhandledError', [exception], {
          url: request.url,
          query: request.query,
        })
      }
    } else {
      error = exception as AppError
    }
    const status = error.getStatus()
    if (!res) {
      res = {
        statusCode: status,
        errorType: error.name,
        error: httpStatus[status],
        message: error.message,
        ...(error.data && { data: error.data }),
      }
    }
    response.status(status).send(res)
  }
}
