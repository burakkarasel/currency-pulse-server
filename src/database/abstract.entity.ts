export class AbstractEntity<T> {
  id: string;
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }
}
