import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "../../src/utils/logger.service";
import { AppError } from "../../src/errors/AppError";

@Injectable()
export class RandomOrgClient {
  private readonly randomOrgBaseUrl = "https://api.random.org";
  private readonly apiKey;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {
    this.apiKey = this.configService.get<string>("randomOrgApi.apiKey");
  }

  async getRandomString(): Promise<string> {
    const response = this.httpService.post(
      `${this.randomOrgBaseUrl}/json-rpc/2/invoke`,
      {
        jsonrpc: "2.0",
        method: "generateStrings",
        params: {
          apiKey: this.apiKey,
          n: 1,
          length: 10,
          characters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        },
        id: 1,
      }
    );

    try {
      const result = await firstValueFrom(response);

      if (result.data?.error) {
        this.logger.error(
          "error response from random.org api",
          result.data?.error
        );
        throw new AppError("third party not working", 500);
      }
      return result.data.result?.random?.data[0] || null;
    } catch (error) {
      this.logger.error("error in getRandomString", error);
      throw error;
    }
  }
}
