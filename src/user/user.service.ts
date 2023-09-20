import { ConflictException, Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { AuthDto } from "src/auth/dto";
import { User } from "./entity";
import * as cryto from "crypto";
import * as bcryptjs from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { UserDto } from "./dto";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async createUser(dto: AuthDto): Promise<UserDto> {
    try {
      const toCreate = new User({
        id: cryto.randomUUID(),
        email: dto.email,
        password: await bcryptjs.hash(
          dto.password,
          +this.configService.getOrThrow("SALTS"),
        ),
        createdAt: new Date(),
      });
      await this.userRepository.createUser(toCreate);
      return new UserDto({
        id: toCreate.id,
        email: toCreate.email,
        createdAt: toCreate.createdAt,
      });
    } catch (err) {
      // mysql error code for duplicate entry
      if (err.errno === 1062) {
        console.log(err);
        throw new ConflictException("Credentials are already taken");
      }
      throw err;
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    const res = await this.userRepository.findUserByEmail(email);
    return new User({ ...res });
  }

  async findUserById(userId: string): Promise<UserDto> {
    const res = await this.userRepository.findUserById(userId);
    return new UserDto({ ...res });
  }
}
