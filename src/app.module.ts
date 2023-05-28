import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OperationsController } from "./operations/operations.controller";
import { OperationsService } from "./operations/operations.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users/users.controller";
import { UsersService } from "./users/users.service";
import { DataSource } from "typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "Password@@01",
        database: "test",
        logging: "all",
        logger: "debug",
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: false,
        autoLoadEntities: true,
      }),
      dataSourceFactory: async (options) => {
        console.error(options);
        //@ts-ignore
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
  ],
  controllers: [AppController, OperationsController, UsersController],
  providers: [AppService, OperationsService, UsersService],
})
export class AppModule {
  constructor() {
    console.error("creating AppModule");
  }
}
