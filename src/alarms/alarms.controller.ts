import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AlarmsService } from "./alarms.service";
import { CreateAlarmDto } from "./dto";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";
import { Alarm } from "./entity";

@Controller("api/v1/alarms")
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}
  @Post()
  @UseGuards(JwtGuard)
  async createAlarm(
    @Body() dto: CreateAlarmDto,
    @GetUser("id") userId: string,
  ): Promise<Alarm> {
    return this.alarmsService.createAlarm(dto, userId);
  }

  @Get()
  @UseGuards(JwtGuard)
  async listUsersAlarms(@GetUser("id") userId: string): Promise<Alarm[]> {
    return this.alarmsService.listUsersAlarms(userId);
  }
}
