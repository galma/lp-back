import { Body, Controller, Get, Post, UsePipes } from "@nestjs/common";
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

@Controller("operations")
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}
  @Post("add")
  async add(@Body() dto: AddRequestDto): Promise<NumericOperationResponseDTO> {
    const result = await this.operationsService.add(dto);
    return result;
  }

  @Post("subtract")
  async subtract(
    @Body() dto: SubtractRequestDto
  ): Promise<NumericOperationResponseDTO> {
    const result = await this.operationsService.subtract(dto);
    return result;
  }

  @Post("multiply")
  async multiply(
    @Body() dto: MultiplyRequestDto
  ): Promise<NumericOperationResponseDTO> {
    const result = await this.operationsService.multiply(dto);
    return result;
  }

  @RequiresJwt()
  @Post("divide")
  async divide(
    @Body() dto: DivideRequestDto
  ): Promise<NumericOperationResponseDTO> {
    const result = await this.operationsService.divide(dto);
    return result;
  }

  @Post("square-root")
  async squareRoot(
    @Body() dto: SquareRootRequestDto
  ): Promise<NumericOperationResponseDTO> {
    const result = await this.operationsService.squareRoot(dto);
    return result;
  }

  @Post("random-string")
  async randomString(
    @Body() dto: RandomStringRequestDto
  ): Promise<StringOperationResponseDTO> {
    const result = await this.operationsService.randomString(dto);
    return result;
  }
}
