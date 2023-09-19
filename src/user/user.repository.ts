import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AbstractRepository } from "src/database/abstract.repository";

@Injectable()
export class UserRepository extends AbstractRepository {
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
}
