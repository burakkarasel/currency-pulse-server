export class UserDto {
  id: string;
  email: string;
  createdAt: Date;
  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
