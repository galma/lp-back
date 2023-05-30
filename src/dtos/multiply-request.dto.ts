import { IsNumber, IsUUID } from "class-validator";

export class MultiplyRequestDto {
  @IsNumber()
  number1: number;

  @IsNumber()
  number2: number;

  @IsUUID()
  userId: string;
}
