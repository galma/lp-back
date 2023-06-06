import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { SignUpRequestDto } from "../../src/dtos/sign-up-request.dto";
import { SignInResponseDTO } from "../../src/dtos/sign-in-response.dto";
import { SignInRequestDto } from "../../src/dtos/sign-in-request.dto";
import { GetUserRecordsResponseDTO } from "../../src/dtos/get-user-records-response.dto";
import { MeResponseDTO } from "../../src/dtos/me-response.dto";
import { RequiresJwt } from "../../src/utils/jwt-auth.interceptor";

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
    return await this.usersService.signIn(dto);
  }

  @Get("me")
  @RequiresJwt()
  async me(@Req() request: Request): Promise<MeResponseDTO> {
    //@ts-ignore
    const userId = request?.user;
    if (!userId) throw new UnauthorizedException();

    return await this.usersService.getUserData(userId);
  }

  @RequiresJwt()
  @Get(":userId/records")
  @RequiresJwt()
  async getUserRecords(
    @Param("userId") userId: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<GetUserRecordsResponseDTO> {
    const {
      records,
      total,
      totalPages,
      previousPage,
      nextPage,
    } = await this.usersService.getUserRecords(userId, page, limit);
    return {
      //@ts-ignore
      records,
      total,
      totalPages,
      previousPage,
      nextPage,
    };
  }
}
