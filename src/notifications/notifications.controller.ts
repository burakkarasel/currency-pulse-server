import { Controller, Get, UseGuards } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";

@Controller("api/v1/notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Get()
  @UseGuards(JwtGuard)
  async listUsersNotifications(@GetUser("id") userId: string) {
    return this.notificationsService.listUsersNotifications(userId);
  }
}
