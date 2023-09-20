import { Controller, Get, UseGuards } from "@nestjs/common";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";
import { UserDto } from "./dto";

@Controller("api/v1/users")
export class UserController {
  @Get()
  @UseGuards(JwtGuard)
  async getUserDetails(@GetUser() user: UserDto) {
    return user;
  }
}
