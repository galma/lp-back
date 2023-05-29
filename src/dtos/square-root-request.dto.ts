import { IsNumber } from "class-validator";

export class SquareRootRequestDto {
  @IsNumber()
  number1: number;

  userId: string;
}
