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
import { HttpExceptionHandlerFilter } from "./utils/exception-handler.filter";
import { EncryptionService } from "./utils/encryption.service";
import JwtService from "./utils/jwt.service";
import { JwtInterceptor } from "./utils/jwt-auth.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({ load: [() => environment], isGlobal: true }),
    //@ts-ignore
    TypeOrmModule.forRoot({
      type: "postgres",
      entities: [User, Operation, Record],
      logging: true,
      logger: "debug",
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
    EncryptionService,
    {
      provide: "APP_PIPE",
      useClass: SchemaValidationPipe,
    },
    {
      provide: "APP_FILTER",
      useClass: HttpExceptionHandlerFilter,
    },
    JwtService,
    {
      provide: "APP_INTERCEPTOR",
      useClass: JwtInterceptor,
    },
  ],
})
export class AppModule {
  constructor() {
    try {
      console.log(config());
    } catch {}
    console.error("creating AppModule");
  }
}
