import { Module } from "@nestjs/common";
import { CronService } from "./cron.service";
import { NotificationsModule } from "src/notifications/notifications.module";
import { AlarmsModule } from "src/alarms/alarms.module";
import { CurrenciesModule } from "src/currencies/currencies.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [NotificationsModule, AlarmsModule, CurrenciesModule, ConfigModule],
  providers: [CronService],
})
export class CronModule {}
