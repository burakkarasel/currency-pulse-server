import { AbstractEntity } from "src/database/abstract.entity";

export class Notification extends AbstractEntity<Notification> {
  content: string;
  userId: string;
  status: boolean;
  createdAt: Date;
}
