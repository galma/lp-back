import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OperationsController } from "./operations/operations.controller";
import { OperationsService } from "./operations/operations.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgre",
      password: "Password@@01",
      database: "test",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: false,
    }),
  ],
  controllers: [AppController, OperationsController, UserController],
  providers: [AppService, OperationsService, UserService],
})
export class AppModule {
  constructor() {
    console.error("creating AppModule");
  }
}
