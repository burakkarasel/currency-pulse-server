import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { CurrenciesService } from "./currencies/currencies.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Origin",
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Authentication",
    ],
  });
  const configService = app.get(ConfigService);
  const currenciesService = app.get(CurrenciesService);
  currenciesService.seedCurrencies();
  await app.listen(+configService.getOrThrow("PORT"));
}
bootstrap();
