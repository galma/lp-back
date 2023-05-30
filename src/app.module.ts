import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OperationsController } from "./operations/operations.controller";
import { OperationsService } from "./operations/operations.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users/users.controller";
import { UsersService } from "./users/users.service";
import { User } from "./entities/user.entity";
import { Operation } from "./entities/operation.entity";
import { Record } from "./entities/record.entity";
import { HttpModule } from "@nestjs/axios";
import { RandomOrgClient } from "./clients/random-org.client";
import { ConfigModule } from "@nestjs/config";
import { environment } from "./configuration/environment";
import { config } from "dotenv";
import { SchemaValidationPipe } from "./utils/schema-validation.pipe";

@Module({
  imports: [
    ConfigModule.forRoot({ load: [() => environment], isGlobal: true }),
    TypeOrmModule.forRoot({
      //@ts-ignore
      type: "postgres",
      entities: [User, Operation, Record],
      synchronize: false,
      ...environment.database,
    }),
    TypeOrmModule.forFeature([User, Operation, Record]),
    HttpModule,
  ],
  controllers: [AppController, OperationsController, UsersController],
  providers: [
    AppService,
    OperationsService,
    UsersService,
    RandomOrgClient,
    {
      provide: "APP_PIPE",
      useClass: SchemaValidationPipe,
    },
  ],
})
export class AppModule {
  constructor() {
    console.log(config());
    console.error("creating AppModule");
  }
}
