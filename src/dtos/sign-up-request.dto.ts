import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class SignUpRequestDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
