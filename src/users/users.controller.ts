import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { SignUpRequestDto } from "../../src/dtos/sign-up-request.dto";
import { SignInResponseDTO } from "../../src/dtos/sign-in-response.dto";
import { SignInRequestDto } from "../../src/dtos/sign-in-request.dto";
import { GetUserRecordsResponseDTO } from "../../src/dtos/get-user-records-response.dto";
import { MeResponseDTO } from "../../src/dtos/me-response.dto";
import { RequiresJwt } from "../../src/utils/jwt-auth.interceptor";
import { UnauthorizedError } from "../../src/errors/Unauthorized";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("sign-up")
  async signUp(@Body() dto: SignUpRequestDto): Promise<SignInResponseDTO> {
    return await this.usersService.signUp(dto);
  }

  @Post("sign-in")
  async signIn(@Body() dto: SignInRequestDto): Promise<SignInResponseDTO> {
    return await this.usersService.signIn(dto);
  }

  @Get("me")
  @RequiresJwt()
  async me(@Req() request: Request): Promise<MeResponseDTO> {
    //@ts-ignore
    const userId = request?.user;
    if (!userId) throw new UnauthorizedError();

    return await this.usersService.getUserData(userId);
  }

  @RequiresJwt()
  @Get(":userId/records")
  @RequiresJwt()
  async getUserRecords(
    @Req() request: Request,
    @Param("userId") userId: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<GetUserRecordsResponseDTO> {
    //@ts-ignore
    this.usersService.assertUserPermissions(userId, request?.user);

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

  @RequiresJwt()
  @Delete(":userId/records/:recordId")
  @RequiresJwt()
  async deleteUserRecord(
    @Req() request: Request,
    @Param("userId") userId: string,
    @Param("recordId") recordId: string
  ): Promise<GetUserRecordsResponseDTO> {
    //@ts-ignore
    this.usersService.assertUserPermissions(userId, request?.user);

    await this.usersService.deleteUserRecord(userId, recordId);

    return;
  }
}
