import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserDto } from "src/user/dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
      password: "password",
    });
  }

  async validate(email: string, password: string): Promise<UserDto> {
    try {
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException(
          "User Not found with given credentials",
        );
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
