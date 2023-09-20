import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AbstractRepository } from "src/database/abstract.repository";
import { Alarm } from "./entity";

@Injectable()
export class AlarmsRepository extends AbstractRepository {
  protected readonly logger = new Logger(AlarmsRepository.name);
  constructor(configService: ConfigService) {
    const config = {
      user: configService.getOrThrow("MYSQL_USER"),
      password: configService.getOrThrow("MYSQL_PASSWORD"),
      host: configService.getOrThrow("MYSQL_HOST"),
      port: +configService.getOrThrow("MYSQL_PORT"),
      database: configService.getOrThrow("MYSQL_DATABASE"),
    };
    super(config);
  }

  async createAlarm(alarm: Alarm): Promise<void> {
    const sql =
      "INSERT INTO `alarms`(id, currency_id, user_id, rate, target_rate, ten_percent_notification_id, ten_percent_rotation_notification_id, target_notification_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await this.query(sql, [
      alarm.id,
      alarm.currencyId,
      alarm.userId,
      alarm.rate,
      alarm.targetRate,
      alarm.tenPercentNotificationId,
      alarm.tenPercentRotationNotificationId,
      alarm.targetNotificationId,
      alarm.createdAt,
    ]);
  }
}
