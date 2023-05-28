import { Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { SignUpRequestDto } from "../../src/dtos/sign-up-request.dto";
import { SignInResponseDTO } from "../../src/dtos/sign-in-response.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    console.error("calling signup");
  }

  @Post("signup")
  async add(dto: SignUpRequestDto): Promise<SignInResponseDTO> {
    console.error("calling signup");
    return await this.usersService.signUp(dto);
  }
}
