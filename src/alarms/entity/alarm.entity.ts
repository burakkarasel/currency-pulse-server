import { AbstractEntity } from "src/database/abstract.entity";

export class Alarm extends AbstractEntity<Alarm> {
  currencyId: string;
  userId: string;
  rate: number;
  targetRate: number;
  tenPercentNotificationId: string;
  tenPercentRotationNotificationId: string;
  targetNotificationId: string;
  createdAt: Date;
}
