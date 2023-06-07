import { Body, Controller, Get, Post, Req, UsePipes } from "@nestjs/common";
import { AddRequestDto } from "../../src/dtos/add-request.dto";
import { DivideRequestDto } from "../../src/dtos/divide-request.dto";
import { NumericOperationResponseDTO } from "../../src/dtos/numeric-operation-response.dto";
import { MultiplyRequestDto } from "../../src/dtos/multiply-request.dto";
import { SubtractRequestDto } from "../../src/dtos/subtract-request.dto";
import { SquareRootRequestDto } from "../../src/dtos/square-root-request.dto";
import { StringOperationResponseDTO } from "../../src/dtos/string-operation-response.dto";
import { OperationsService } from "./operations.service";
import { RandomStringRequestDto } from "../../src/dtos/random-string-request.dto";
import { RequiresJwt } from "../../src/utils/jwt-auth.interceptor";
import { UsersService } from "../../src/users/users.service";

@Controller("operations")
export class OperationsController {
  constructor(
    private readonly operationsService: OperationsService,
    private readonly usersService: UsersService
  ) {}

  @RequiresJwt()
  @Post("add")
  async add(
    @Req() request: Request,
    @Body() dto: AddRequestDto
  ): Promise<NumericOperationResponseDTO> {
    //@ts-ignore
    this.usersService.assertUserPermissions(dto.userId, request?.user);

    const result = await this.operationsService.add(dto);
    return result;
  }

  @RequiresJwt()
  @Post("subtract")
  async subtract(
    @Req() request: Request,
    @Body() dto: SubtractRequestDto
  ): Promise<NumericOperationResponseDTO> {
    //@ts-ignore
    this.usersService.assertUserPermissions(dto.userId, request?.user);

    const result = await this.operationsService.subtract(dto);
    return result;
  }

  @RequiresJwt()
  @Post("multiply")
  async multiply(
    @Req() request: Request,
    @Body() dto: MultiplyRequestDto
  ): Promise<NumericOperationResponseDTO> {
    //@ts-ignore
    this.usersService.assertUserPermissions(dto.userId, request?.user);

    const result = await this.operationsService.multiply(dto);
    return result;
  }

  @RequiresJwt()
  @Post("divide")
  async divide(
    @Req() request: Request,
    @Body() dto: DivideRequestDto
  ): Promise<NumericOperationResponseDTO> {
    //@ts-ignore
    this.usersService.assertUserPermissions(dto.userId, request?.user);

    const result = await this.operationsService.divide(dto);
    return result;
  }

  @RequiresJwt()
  @Post("square-root")
  async squareRoot(
    @Req() request: Request,
    @Body() dto: SquareRootRequestDto
  ): Promise<NumericOperationResponseDTO> {
    //@ts-ignore
    this.usersService.assertUserPermissions(dto.userId, request?.user);

    const result = await this.operationsService.squareRoot(dto);
    return result;
  }

  @RequiresJwt()
  @Post("random-string")
  async randomString(
    @Req() request: Request,
    @Body() dto: RandomStringRequestDto
  ): Promise<StringOperationResponseDTO> {
    //@ts-ignore
    this.usersService.assertUserPermissions(dto.userId, request?.user);

    const result = await this.operationsService.randomString(dto);
    return result;
  }
}
