import { AbstractEntity } from "src/database/abstract.entity";

export class Currency extends AbstractEntity<Currency> {
  name: string;
  value: number;
  createdAt: Date;
}
