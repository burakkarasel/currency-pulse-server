import { Module } from "@nestjs/common";
import { AlarmsController } from "./alarms.controller";
import { AlarmsService } from "./alarms.service";
import { AlarmsRepository } from "./alarms.repository";
import { CurrenciesModule } from "src/currencies/currencies.module";

@Module({
  imports: [CurrenciesModule],
  controllers: [AlarmsController],
  providers: [AlarmsService, AlarmsRepository],
  exports: [AlarmsService],
})
export class AlarmsModule {}
