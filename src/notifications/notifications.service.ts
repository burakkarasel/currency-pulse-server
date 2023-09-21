import { Injectable } from "@nestjs/common";
import { NotificationsRepository } from "./notifications.repository";
import { CreateNotificationDto } from "./dto";
import { Notification } from "./entity";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsRepository.createNewNotification(
      dto.notification,
      dto.alarmId,
      dto.field,
    );
  }

  convertDbResultToNotification(res: any): Notification {
    return new Notification({
      id: res.id,
      title: res.title,
      content: res.content,
      createdAt: res.createdAt,
      userId: res.userId,
      status: res.status,
    });
  }

  async listUsersNotifications(userId: string): Promise<Notification[]> {
    const res =
      await this.notificationsRepository.listUsersNotifications(userId);
    return res.map(this.convertDbResultToNotification);
  }
}
