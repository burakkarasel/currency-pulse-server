import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { AuthDto } from "./dto";
import { UserDto } from "src/user/dto";
import * as bcryptjs from "bcryptjs";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: AuthDto): Promise<UserDto> {
    return this.userService.createUser(dto);
  }

  async validateUser(email: string, password: string): Promise<UserDto> {
    try {
      // fetch user from DB
      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException(
          "User Not found with given credentials",
        );
      }
      // compare passwords
      const compareResult = await bcryptjs.compare(password, user.password);
      if (!compareResult) {
        throw new UnauthorizedException(
          "User Not found with given credentials",
        );
      }
      // return the dto
      return new UserDto({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      });
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async signIn(user: UserDto, res: Response): Promise<string> {
    // sign token for the user
    const token = await this.signToken(user);
    // put it in a cookie
    res.cookie("token", token, {
      secure: false,
      domain: "localhost",
      httpOnly: true,
      maxAge: this.configService.getOrThrow("TOKEN_EXPIRATION") * 1000,
    });
    return token;
  }

  async signToken(user: UserDto): Promise<string> {
    const payload = { sub: user.id, username: user.email };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow("TOKEN_SECRET_KEY"),
      expiresIn: `${this.configService.getOrThrow("TOKEN_EXPIRATION")}s`,
    });
    return token;
  }
}
