import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UserService } from "src/user/user.service";
import { Request } from "express";
import { UserDto } from "src/user/dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req?.cookies?.token) {
            return req?.cookies?.token;
          }
          return req?.headers?.authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow("TOKEN_SECRET_KEY"),
    });
  }

  async validate(payload: any): Promise<UserDto> {
    try {
      const user = await this.userService.findUserById(payload.sub);
      return user;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
