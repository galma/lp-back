import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OperationsController } from './operations/operations.controller';
import { OperationsService } from './operations/operations.service';

@Module({
  imports: [],
  controllers: [AppController, OperationsController],
  providers: [AppService, OperationsService],
})
export class AppModule {
  constructor() {
    console.error("creating AppModule");
  }
}
