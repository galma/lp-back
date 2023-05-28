import { IsNumber } from "class-validator";

export class AddRequestDto {
  @IsNumber()
  number1: number;

  @IsNumber()
  number2: number;

  userId: string;
}
