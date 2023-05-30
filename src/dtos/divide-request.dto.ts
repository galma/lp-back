import { IsNumber, IsUUID } from "class-validator";
import { IsNotEqualToZero } from "../../src/utils/common";

export class DivideRequestDto {
  @IsNumber()
  number1: number;

  @IsNumber()
  @IsNotEqualToZero("division by 0 doesn't exist")
  number2: number;

  @IsUUID()
  userId: string;
}
