import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AbstractRepository } from "src/database/abstract.repository";
import { Notification } from "./entity";

@Injectable()
export class NotificationsRepository extends AbstractRepository {
  protected readonly logger = new Logger(NotificationsRepository.name);
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

  async listUsersNotifications(userId: string) {
    const sql =
      "SELECT id, title, content, user_id as userId, status, created_at as createdAt FROM notifications WHERE user_id = ?";
    const res = await this.query(sql, [userId]);
    return res;
  }

  async createNewNotification(
    notification: Notification,
    alarmId: string,
    field: string,
  ): Promise<Notification> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((firstErr, conn) => {
        if (firstErr) {
          reject(firstErr);
          this.logger.error(
            `Couldnt create a connection with pool: ${firstErr.message}`,
          );
        }
        conn.beginTransaction((secondErr) => {
          if (secondErr) {
            this.logger.error(
              `Couldnt start a transaction with connection: ${secondErr.message}`,
            );
            reject(secondErr);
          }
          const insert = `INSERT INTO notifications (id, user_id, title, content, status, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
          conn.query(
            insert,
            [
              notification.id,
              notification.userId,
              notification.title,
              notification.content,
              notification.status,
              notification.createdAt,
            ],
            (thirdErr) => {
              if (thirdErr) {
                this.logger.error(
                  `Couldnt insert a notification with connection: ${thirdErr.message}`,
                );
                return conn.rollback(() => reject(thirdErr));
              }
              const update = `UPDATE alarms SET ?? = ? WHERE id = ?`;
              conn.query(
                update,
                [field, notification.id, alarmId],
                (fourthErr, results) => {
                  if (fourthErr) {
                    this.logger.error(
                      `Couldnt update the alarm with ID: ${alarmId} while updating ${field} field with value: ${notification.id}, error: ${fourthErr.message}`,
                    );
                    return conn.rollback(() => reject(fourthErr));
                  }
                  if (results.affectedRows !== 1) {
                    this.logger.error(
                      `Couldnt update the alarm with ID: ${alarmId} while updating ${field} field with value: ${notification.id} because no alarm found!`,
                    );
                    reject(new Error("Couldn't update the alarm not found!"));
                  }
                  conn.commit((fifthErr) => {
                    if (fifthErr) {
                      this.logger.error(
                        `Couldnt commit transaction with error: ${fifthErr.message}`,
                      );
                      return conn.rollback(() => reject(fifthErr));
                    }
                    resolve(notification);
                    this.logger.verbose(
                      `Successfully created new notification with ID: ${notification.id} and updated alarm with ID: ${alarmId}`,
                    );
                  });
                },
              );
            },
          );
        });
      });
    });
  }
}
