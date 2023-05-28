import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { SignUpRequestDto } from "../../src/dtos/sign-up-request.dto";
import { SignInResponseDTO } from "../../src/dtos/sign-in-response.dto";
import { SignInRequestDto } from "src/dtos/sign-in-request.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    console.error("calling signup");
  }

  @Post("sign-up")
  async signUp(@Body() dto: SignUpRequestDto): Promise<SignInResponseDTO> {
    console.error("calling signup", dto);
    return await this.usersService.signUp(dto);
  }

  @Post("sign-in")
  async signIn(@Body() dto: SignInRequestDto): Promise<SignInResponseDTO> {
    console.error("calling signin", dto);
    return await this.usersService.signUp(dto);
  }
}
