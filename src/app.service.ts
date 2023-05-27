import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  constuctor() {}

  getHello(): string {
    return "Hello World";
  }
}
