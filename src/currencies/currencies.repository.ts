import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AbstractRepository } from "src/database/abstract.repository";
import { Currency } from "./entity/index.js";
import { Currencies } from "./enums";

@Injectable()
export class CurrenciesRepository extends AbstractRepository {
  protected readonly logger = new Logger(CurrenciesRepository.name);
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

  async createCurrency(currency: Currency) {
    const sql =
      "INSERT INTO currencies (id, name, value, created_at) VALUES(?, ?, ?, ?)";
    await this.query(sql, [
      currency.id,
      currency.name,
      currency.value,
      currency.createdAt,
    ]);
  }

  async deleteOldValues() {
    const createdAt = new Date();
    createdAt.setHours(createdAt.getHours() - 5);
    const sql = "DELETE FROM currencies WHERE created_at < ? AND name = 'G-1'";
    await this.query(sql, [createdAt]);
  }

  async getLastFiveHoursAverage(): Promise<number> {
    const createdAt = new Date();
    createdAt.setHours(createdAt.getHours() - 5);
    const sql =
      "SELECT AVG(value) as average FROM currencies WHERE created_at >= ? AND name = 'G-1'";
    const res = await this.query(sql, [createdAt]);
    if (!res.length) {
      throw new InternalServerErrorException("Something went wrong");
    }
    return res[0].average;
  }

  async updateUsdAndEurValue(
    currentUsdRate: number,
    currentEurRate: number,
  ): Promise<void> {
    const usdSql = "UPDATE SET value = ? WHERE name = 'USD'";
    let res = await this.query(usdSql, [currentUsdRate]);
    if (!res.affectedRows) {
      throw new InternalServerErrorException(
        "Something went wrong while updating USD value",
      );
    }
    const eurSql = "UPDATE SET value = ? WHERE name = 'EUR'";
    res = await this.query(eurSql, [currentEurRate]);
    if (!res.affectedRows) {
      throw new InternalServerErrorException(
        "Something went wrong while updating EUR value",
      );
    }
    return;
  }

  async getCurrentValueOf(currency: Currencies): Promise<number> {
    let sql =
      "SELECT value FROM currencies WHERE name = 'G-1' ORDER BY created_at DESC LIMIT 1";
    if (currency !== Currencies.GOLD) {
      sql = "SELECT value FROM currencies WHERE name = ?";
      const res = await this.query(sql, [currency]);
      if (!res.length) {
        throw new InternalServerErrorException("Something went wrong");
      }
      return res[0].value;
    }
    const res = await this.query(sql);
    if (!res.length) {
      throw new InternalServerErrorException("Something went wrong");
    }
    return res[0].value;
  }
}
