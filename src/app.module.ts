import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OperationsController } from './operations/operations.controller';

@Module({
  imports: [],
  controllers: [AppController, OperationsController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.error("creating AppModule");
  }
}
