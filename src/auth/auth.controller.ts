import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { UserDto } from "src/user/dto";

@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  async signUp(@Body() dto: AuthDto): Promise<UserDto> {
    return this.authService.signUp(dto);
  }
}
