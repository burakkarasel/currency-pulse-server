import { Injectable, Logger } from "@nestjs/common";
import { CurrenciesRepository } from "./currencies.repository";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Currency } from "./entity.ts";
import * as crypto from "crypto";
import { Currencies } from "./enums";

@Injectable()
export class CurrenciesService {
  private logger = new Logger(CurrenciesService.name);
  constructor(
    private readonly currenciesRepository: CurrenciesRepository,
    private readonly configService: ConfigService,
  ) {}

  async seedCurrencies() {
    try {
      const currencies = await this.getAllCurrencies();
      await Promise.all(
        currencies.map((item) => {
          return this.currenciesRepository.createCurrency(item);
        }),
      );
    } catch (err) {
      this.logger.error(
        "Error while batch inserting seed values: ",
        err.message,
      );
      throw err;
    }
  }

  async getAllCurrencies(): Promise<Currency[]> {
    try {
      const res = await axios.get(this.configService.getOrThrow("API_URL"));
      const currencies: Currency[] = [];
      currencies.push(
        new Currency({
          id: crypto.randomUUID(),
          name: res.data.data.C.USD.code,
          value: res.data.data.C.USD.selling,
          createdAt: new Date(),
        }),
      );
      currencies.push(
        new Currency({
          id: crypto.randomUUID(),
          name: res.data.data.C.EUR.code,
          value: res.data.data.C.EUR.selling,
          createdAt: new Date(),
        }),
      );
      currencies.push(
        new Currency({
          id: crypto.randomUUID(),
          name: "G-1",
          value: res.data.data.G["gram-altin"].selling,
          createdAt: new Date(),
        }),
      );
      return currencies;
    } catch (error) {
      this.logger.error("Error while fetching seed values: ", error.message);
      throw error;
    }
  }

  async createCurrency(currency: Currency): Promise<Currency> {
    await this.currenciesRepository.createCurrency(currency);
    return currency;
  }

  // @Cron(CronExpression.EVERY_MINUTE)
  // async handleMinuteRotation() {
  //   try {
  //     const currentGoldValue = await this.getCurrentGoldValue();
  //     await this.currenciesRepository.createCurrency(currentGoldValue);
  //     await this.minuteTargetHelper(currentGoldValue.value);
  //     await this.minuteTenPercentHelper(currentGoldValue.value);
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw new InternalServerErrorException(
  //       `Something went wrong while handling per minute rotation: ${error.message}`,
  //     );
  //   }
  // }

  async getCurrentGoldValue(): Promise<Currency> {
    const res = await axios.get(this.configService.getOrThrow("API_URL"));
    return new Currency({
      value: res.data.data.G["gram-altin"].selling,
      name: "G-1",
      createdAt: new Date(),
      id: crypto.randomUUID(),
    });
  }

  async getCurrentValueOf(currencies: Currencies): Promise<number> {
    return this.currenciesRepository.getCurrentValueOf(currencies);
  }

  // @Cron(CronExpression.EVERY_5_HOURS)
  // async handleFiveHourRotation() {
  //   try {
  //     await this.fiveHourHelper();
  //   } catch (error) {
  //     this.logger.error(
  //       `Something went wrong during 5 hour rotation ${error.message}`,
  //     );
  //     throw error;
  //   }
  // }

  // calculatePercentage(rate: number, average: number): number {
  //   return (average / rate) * 100 - 100;
  // }

  async getLastFiveHoursAverage(): Promise<number> {
    return this.currenciesRepository.getLastFiveHoursAverage();
  }

  async deleteOldValues() {
    await this.currenciesRepository.deleteOldValues();
  }

  async updateUsdAndEurValue(): Promise<void> {
    const res = await this.getAllCurrencies();
    const eurRate = res.find((item) => item.name === "EUR").value;
    const usdRate = res.find((item) => item.name === "USD").value;
    await this.currenciesRepository.updateUsdAndEurValue(usdRate, eurRate);
  }
}
