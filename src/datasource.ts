import { DataSource } from "typeorm";
import { environment } from "./configuration/environment";

//@ts-ignore
export const AppDataSource = new DataSource({
  type: "postgres",
  entities: ["./src/entities/**/*.ts"],
  migrations: ["./src/migrations/**/*.ts"],
  synchronize: false,
  logging: true,
  ...environment.database,
});
