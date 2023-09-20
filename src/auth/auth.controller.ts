import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { UserDto } from "src/user/dto";
import { LocalGuard } from "./guard";
import { GetUser } from "./decorator";
import { Response } from "express";

@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  async signUp(@Body() dto: AuthDto): Promise<UserDto> {
    return this.authService.signUp(dto);
  }

  @Post("sign-in")
  @UseGuards(LocalGuard)
  async signIn(
    @GetUser() user: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signIn(user, res);
    res.send({ message: "OK" });
  }
}
