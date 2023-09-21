import { AbstractEntity } from "src/database/abstract.entity";

export class Notification extends AbstractEntity<Notification> {
  title: string;
  content: string;
  userId: string;
  status: boolean;
  createdAt: Date;
}
