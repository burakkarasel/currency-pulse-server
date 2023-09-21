import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Currencies } from "src/currencies/enums";

export class CreateAlarmDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(Currencies)
  currencyName: Currencies;
  @IsNotEmpty()
  @IsNumber()
  targetRate: number;
}
