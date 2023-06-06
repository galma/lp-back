import { Injectable } from "@nestjs/common";
import { Logger, createLogger, format, transports } from "winston";

@Injectable()
export class LoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: [new transports.Console()],
    });
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string, error: any) {
    this.logger.error(message, [error]);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
