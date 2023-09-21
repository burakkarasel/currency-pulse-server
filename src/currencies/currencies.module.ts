import { Module } from "@nestjs/common";
import { CurrenciesService } from "./currencies.service";
import { CurrenciesController } from "./currencies.controller";
import { CurrenciesRepository } from "./currencies.repository";

@Module({
  imports: [],
  providers: [CurrenciesService, CurrenciesRepository],
  controllers: [CurrenciesController],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
