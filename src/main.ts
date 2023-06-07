import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "dotenv";

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  if (process.env.ENVIRONMENT === "local") {
    app.enableCors();
    app.setGlobalPrefix("v1");
    console.log("cors enabled");
  }

  await app.listen(3000);
}
bootstrap();
