import { Injectable } from "@nestjs/common";
import { AlarmsRepository } from "./alarms.repository";
import { CreateAlarmDto } from "./dto";
import { Alarm } from "./entity";
import * as cryto from "crypto";

@Injectable()
export class AlarmsService {
  constructor(private readonly alarmsRepository: AlarmsRepository) {}

  async createAlarm(dto: CreateAlarmDto, userId: string): Promise<Alarm> {
    try {
      const alarm = new Alarm({
        id: cryto.randomUUID(),
        userId,
        rate: dto.rate,
        targetRate: dto.targetRate,
        createdAt: new Date(),
        currencyId: dto.currencyId,
      });

      await this.alarmsRepository.createAlarm(alarm);
      return alarm;
    } catch (err) {}
  }
}
