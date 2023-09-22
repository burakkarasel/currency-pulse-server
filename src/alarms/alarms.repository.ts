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

  async listUsersAlarms(userId: string) {
    const sql = `
    SELECT id, currency_name as currencyName, user_id as userId, rate,
    target_rate as targetRate, target_notification_id as targetNotificationId,
    ten_percent_notification_id as tenPercentNotificationId,
    ten_percent_rotation_notification_id as tenPercentRotationNotificationId, created_at as createdAt 
    FROM alarms 
    WHERE user_id = ?
    ORDER BY created_at DESC
    `;
    const res = await this.query(sql, [userId]);
    return res;
  }

  async createAlarm(alarm: Alarm): Promise<Alarm> {
    const sql =
      "INSERT INTO `alarms`(id, currency_name, user_id, rate, current_gold_rate, target_rate, ten_percent_notification_id, ten_percent_rotation_notification_id, target_notification_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await this.query(sql, [
      alarm.id,
      alarm.currencyName,
      alarm.userId,
      alarm.rate,
      alarm.currentGoldRate,
      alarm.targetRate,
      alarm.tenPercentNotificationId,
      alarm.tenPercentRotationNotificationId,
      alarm.targetNotificationId,
      alarm.createdAt,
    ]);
    return alarm;
  }

  async listAlarmsByTargetRate(targetRate: number) {
    const sql = `
    SELECT id, currency_name as currencyName, user_id as userId, rate, current_gold_rate as currentGoldRate,
    target_rate as targetRate, target_notification_id as targetNotificationId,
    ten_percent_notification_id as tenPercentNotificationId,
    ten_percent_rotation_notification_id as tenPercentRotationNotificationId, created_at as createdAt 
    FROM alarms 
    WHERE target_notification_id IS NULL AND target_rate <= ?
    `;
    const res = await this.query(sql, [targetRate]);
    return res;
  }

  async listAlarmsByTenPercent(currentRate: number) {
    const sql = `
    SELECT id, currency_name as currencyName, user_id as userId, rate, current_gold_rate as currentGoldRate,
    target_rate as targetRate, target_notification_id as targetNotificationId, 
    ten_percent_notification_id as tenPercentNotificationId,
    ten_percent_rotation_notification_id as tenPercentRotationNotificationId, created_at as createdAt 
    FROM alarms 
    WHERE ten_percent_notification_id IS NULL AND rate * 1.10 <= ?
    `;
    const res = await this.query(sql, [currentRate]);
    return res;
  }

  async listAlarmsByTenPercentRotation(currentRate: number) {
    const sql = `
    SELECT id, currency_name as currencyName, user_id as userId, rate, current_gold_rate as currentGoldRate,
    target_rate as targetRate, target_notification_id as targetNotificationId,
    ten_percent_notification_id as tenPercentNotificationId,
    ten_percent_rotation_notification_id as tenPercentRotationNotificationId, created_at as createdAt
    FROM alarms 
    WHERE ten_percent_rotation_notification_id IS NULL AND rate * 1.10 <= ?
    `;
    const res = await this.query(sql, [currentRate]);
    return res;
  }
}
