import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AlarmsService } from "./alarms.service";
import { CreateAlarmDto } from "./dto";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";

@Controller("api/v1/alarms")
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}
  @Post()
  @UseGuards(JwtGuard)
  async createAlarm(
    @Body() dto: CreateAlarmDto,
    @GetUser("id") userId: string,
  ) {
    return this.alarmsService.createAlarm(dto, userId);
  }
}
