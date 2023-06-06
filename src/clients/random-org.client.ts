import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RandomOrgClient {
  private readonly randomOrgBaseUrl = "https://api.random.org";
  private readonly apiKey;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {
    console.log("RandomOrgClient");
    this.apiKey = this.configService.get<string>("randomOrgApi.apiKey");
    console.log("RandomOrgClient initialized");
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
        console.log(JSON.stringify(result.data?.error));
        throw new Error();
      }

      return result.data.result?.random?.data[0] || null;
    } catch (error) {
      console.log(JSON.stringify(error));
      throw error;
    }
  }
}
