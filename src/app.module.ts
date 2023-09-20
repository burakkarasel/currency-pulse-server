import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { AlarmsModule } from './alarms/alarms.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AlarmsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
