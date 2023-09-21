import { Injectable } from "@nestjs/common";
import { AlarmsRepository } from "./alarms.repository";
import { CreateAlarmDto } from "./dto";
import { Alarm } from "./entity";
import * as cryto from "crypto";
import { Currencies } from "../currencies/enums";
import { CurrenciesService } from "src/currencies/currencies.service";

@Injectable()
export class AlarmsService {
  constructor(
    private readonly alarmsRepository: AlarmsRepository,
    private readonly currenciesService: CurrenciesService,
  ) {}

  async createAlarm(dto: CreateAlarmDto, userId: string): Promise<Alarm> {
    try {
      const rate = await this.currenciesService.getCurrentValueOf(
        dto.currencyName,
      );
      const goldRate = await this.currenciesService.getCurrentValueOf(
        Currencies.GOLD,
      );
      const targetRate = (dto.targetRate / rate) * goldRate;
      const alarm = new Alarm({
        id: cryto.randomUUID(),
        currencyName: dto.currencyName,
        userId,
        rate,
        targetRate,
        createdAt: new Date(),
      });

      const created = await this.alarmsRepository.createAlarm(alarm);
      return created;
    } catch (err) {
      throw err;
    }
  }

  convertDbResultsToAlarms(alarms: any[]): Alarm[] {
    return alarms.map(
      (item: any) =>
        new Alarm({
          id: item.id,
          currencyName: item.currencyName,
          userId: item.userId,
          rate: item.rate,
          targetRate: item.targetRate,
          targetNotificationId: item.targetNotificationId,
          tenPercentNotificationId: item.tenPercentNotificationId,
          tenPercentRotationNotificationId:
            item.tenPercentRotationNotificationId,
        }),
    );
  }

  async listAlarmsByTargetRate(rate: number): Promise<Alarm[]> {
    const res = await this.alarmsRepository.listAlarmsByTargetRate(rate);
    return this.convertDbResultsToAlarms(res);
  }

  async listAlarmsByTenPercent(rate: number): Promise<Alarm[]> {
    const res = await this.alarmsRepository.listAlarmsByTenPercent(rate);
    return this.convertDbResultsToAlarms(res);
  }

  async listAlarmsByTenPercentRotation(rate: number): Promise<Alarm[]> {
    const res =
      await this.alarmsRepository.listAlarmsByTenPercentRotation(rate);
    return this.convertDbResultsToAlarms(res);
  }
}
