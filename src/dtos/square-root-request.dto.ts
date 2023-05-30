import { IsNumber, IsUUID } from "class-validator";

export class SquareRootRequestDto {
  @IsNumber()
  number1: number;

  @IsUUID()
  userId: string;
}
