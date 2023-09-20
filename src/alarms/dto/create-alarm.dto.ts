import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateAlarmDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  currencyId: string;
  @IsNotEmpty()
  @IsNumber()
  rate: number;
  @IsNotEmpty()
  @IsNumber()
  targetRate: number;
}
