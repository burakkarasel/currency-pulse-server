import { Notification } from "../entity";

export class CreateNotificationDto {
  notification: Notification;
  alarmId: string;
  field: string;
  constructor(partial: Partial<CreateNotificationDto>) {
    Object.assign(this, partial);
  }
}
