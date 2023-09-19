import { AbstractEntity } from "src/database/abstract.entity";

export class User extends AbstractEntity<User> {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
}
