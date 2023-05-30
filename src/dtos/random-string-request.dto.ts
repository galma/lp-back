import { IsUUID } from "class-validator";

export class RandomStringRequestDto {
  @IsUUID()
  userId: string;
}
