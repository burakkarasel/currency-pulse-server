import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { AuthDto } from "./dto";
import { UserDto } from "src/user/dto";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUp(dto: AuthDto): Promise<UserDto> {
    return this.userService.createUser(dto);
  }
}
