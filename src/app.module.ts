import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OperationsController } from "./operations/operations.controller";
import { OperationsService } from "./operations/operations.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users/users.controller";
import { UsersService } from "./users/users.service";
import { User } from "./entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "Password@@01",
      database: "test",
      entities: [User],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController, OperationsController, UsersController],
  providers: [AppService, OperationsService, UsersService],
})
export class AppModule {
  constructor() {
    console.error("creating AppModule");
  }
}
