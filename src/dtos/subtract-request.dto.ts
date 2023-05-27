import { IsNumber } from "class-validator";

export class SubtractRequestDto {
  @IsNumber()
  number1: number;

  @IsNumber()
  number2: number;
}
