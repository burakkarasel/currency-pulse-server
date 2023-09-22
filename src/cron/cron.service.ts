import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AlarmsService } from "src/alarms/alarms.service";
import { CurrenciesService } from "src/currencies/currencies.service";
import { CreateNotificationDto } from "src/notifications/dto";
import { NotificationsService } from "src/notifications/notifications.service";
import { Notification } from "src/notifications/entity";
import * as crypto from "crypto";
import { Alarm } from "src/alarms/entity";

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
    private readonly alarmsService: AlarmsService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleMinuteRotation() {
    try {
      const currentGoldValue =
        await this.currenciesService.getCurrentGoldValue();
      currentGoldValue.value = 2100;
      await this.currenciesService.createCurrency(currentGoldValue);
      await this.minuteTargetHelper(currentGoldValue.value);
      await this.minuteTenPercentHelper(currentGoldValue.value);
      this.logger.verbose("Successfully completed the per minute rotation");
    } catch (error) {
      this.logger.error(
        `Something went wrong while completing per minute rotation: ${error.message}`,
      );
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_5_HOURS)
  async handleFiveHourRotation() {
    try {
      const currentGoldValue =
        await this.currenciesService.getCurrentGoldValue();
      currentGoldValue.value = 2000;
      await this.fiveHourHelper(currentGoldValue.value);
      this.logger.verbose("Successfully completed the per 5 hour rotation");
    } catch (error) {
      this.logger.error(
        `Something went wrong while completing per 5 hour rotation: ${error.message}`,
      );
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async handleDailyRotation() {
    try {
      await this.currenciesService.updateUsdAndEurValue();
      this.logger.verbose("Successfully updated EUR and USD values");
    } catch (error) {
      this.logger.error(
        `Something went wrong while updating the EUR and USD value daily: ${error.message}`,
      );
      throw error;
    }
  }

  calculatePercentage(rate: number, average: number): number {
    return (average / rate) * 100 - 100;
  }

  async minuteTargetHelper(currentGoldValue: number) {
    try {
      const needToNotify =
        await this.alarmsService.listAlarmsByTargetRate(currentGoldValue);
      const toWriteDb: CreateNotificationDto[] = needToNotify.map((item) => {
        const content = this.prepareNotificationContent(item, currentGoldValue);
        return new CreateNotificationDto({
          notification: new Notification({
            id: crypto.randomUUID(),
            title: "Reached Target",
            content,
            createdAt: new Date(),
            userId: item.userId,
            status: false,
          }),
          alarmId: item.id,
          field: "target_notification_id",
        });
      });
      await Promise.all(
        toWriteDb.map((item) => {
          return this.notificationsService.createNotification(item);
        }),
      );
      this.logger.verbose(
        `Successfully inserted ${toWriteDb.length} notifications into DB with target minute rotation`,
      );
    } catch (error) {
      this.logger.error(
        `Error while batch inserting notifications or batch updating alarms in target helper: ${error}`,
      );
      throw error;
    }
  }

  async minuteTenPercentHelper(currentGoldValue: number) {
    try {
      const needToNotify =
        await this.alarmsService.listAlarmsByTenPercent(currentGoldValue);
      const toWriteDb: CreateNotificationDto[] = needToNotify.map((item) => {
        const content = this.prepareNotificationContent(item, currentGoldValue);
        return new CreateNotificationDto({
          notification: new Notification({
            id: crypto.randomUUID(),
            title: "Reached %10",
            content,
            createdAt: new Date(),
            userId: item.userId,
            status: false,
          }),
          alarmId: item.id,
          field: "ten_percent_notification_id",
        });
      });
      await Promise.all(
        toWriteDb.map((item) => {
          return this.notificationsService.createNotification(item);
        }),
      );
      this.logger.verbose(
        `Successfully inserted ${toWriteDb.length} notifications into DB with ten percent minute rotation`,
      );
    } catch (error) {
      this.logger.error(
        `Error while batch inserting notifications or batch updating alarms in ten percent helper: ${error.message}`,
      );
      throw error;
    }
  }

  async fiveHourHelper(currentGoldValue: number) {
    try {
      // first we get the last five hours average for the gold value
      const average = await this.currenciesService.getLastFiveHoursAverage();
      // then we get the alarms that has not modified yet and their values matches the ten percent increase
      const needToNotify =
        await this.alarmsService.listAlarmsByTenPercentRotation(average);
      // then we transform the values so we can write DB
      const toWriteDb: CreateNotificationDto[] = needToNotify.map((item) => {
        const content = this.prepareNotificationContent(item, currentGoldValue);
        return new CreateNotificationDto({
          notification: new Notification({
            id: crypto.randomUUID(),
            title: "Reached %10 last five hours",
            content,
            userId: item.userId,
            createdAt: new Date(),
            status: false,
          }),
          alarmId: item.id,
          field: "ten_percent_rotation_notification_id",
        });
      });
      // then we execute them
      await Promise.all(
        toWriteDb.map((item) => {
          return this.notificationsService.createNotification(item);
        }),
      );
      this.logger.verbose(
        `Successfully inserted ${toWriteDb.length} notifications into DB with ten percent 5 hour rotation`,
      );
      // and also here we clear the old unnecessary values that are older than 5 hours
      await this.currenciesService.deleteOldValues();
    } catch (error) {
      this.logger.error(
        `Error while batch inserting notifications or batch updating alarms in ten percen 5 hour rotation helper: ${error.message}`,
      );
      throw error;
    }
  }

  prepareNotificationContent(alarm: Alarm, currentGoldValue: number): string {
    return `Your alarm for ${alarm.currencyName}: ${
      alarm.currencyName
    } increased ${this.roundToTwoDecimals(
      this.calculatePercentage(alarm.currentGoldRate, currentGoldValue),
    )} percent. It went from ${alarm.rate} to ${this.calculateTargetRate(
      alarm.rate,
      alarm.currentGoldRate,
      currentGoldValue,
    )}`;
  }

  calculateTargetRate(
    rate: number,
    currentGoldRate: number,
    currentGoldValue: number,
  ): number {
    return this.roundToTwoDecimals((rate / currentGoldRate) * currentGoldValue);
  }

  roundToTwoDecimals(float: number): number {
    const roundedStr = float.toFixed(2);
    return parseFloat(roundedStr);
  }
}
