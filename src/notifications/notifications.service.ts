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
    console.log("Notifications Repository: ", this.notificationsRepository);
    return this.notificationsRepository.createNewNotification(
      dto.notification,
      dto.alarmId,
      dto.field,
    );
  }
}
