import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AbstractRepository } from "src/database/abstract.repository";
import { User } from "./entity";

@Injectable()
export class UserRepository extends AbstractRepository {
  protected readonly logger = new Logger(UserRepository.name);
  constructor(configService: ConfigService) {
    const config = {
      user: configService.getOrThrow("MYSQL_USER"),
      password: configService.getOrThrow("MYSQL_PASSWORD"),
      host: configService.getOrThrow("MYSQL_HOST"),
      port: +configService.getOrThrow("MYSQL_PORT"),
      database: configService.getOrThrow("MYSQL_DATABASE"),
    };
    super(config);
  }

  async createUser(user: User): Promise<void> {
    const sql =
      "INSERT INTO `users`(id, email, password, created_at) VALUES(?, ?, ?, ?)";
    await this.query(sql, [user.id, user.email, user.password, user.createdAt]);
  }

  async findUserByEmail(email: string) {
    try {
      const sql =
        "SELECT id, email, password, created_at as createdAt FROM users WHERE email = ? LIMIT = 1";
      const res = await this.query(sql, [email]);
      if (!res.length) {
        throw new NotFoundException("User not found with given credentials");
      }
      return res[0];
    } catch (err) {
      throw err;
    }
  }

  async findUserById(id: string) {
    try {
      const sql =
        "SELECT id, email, created_at as createdAt FROM users WHERE id = ? LIMIT = 1";
      const res = await this.query(sql, [id]);
      if (!res.length) {
        throw new NotFoundException("User not found");
      }
      return res[0];
    } catch (err) {
      throw err;
    }
  }
}
