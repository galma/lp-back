import { Controller, Get, Post } from "@nestjs/common";
import { AddRequestDto } from "../../src/dtos/add-request.dto";
import { DivideRequestDto } from "../../src/dtos/divide-request.dto";
import { NumericOperationResponseDTO } from "../../src/dtos/numeric-operation-response.dto";
import { MultiplyRequestDto } from "../../src/dtos/multiply-request.dto";
import { SubtractRequestDto } from "../dtos/subtract-request.dto";
import { SquareRootRequestDto } from "../dtos/square-root-request.dto";
import { StringOperationResponseDTO } from "../dtos/string-operation-response.dto";
import { OperationsService } from "./operations.service";

@Controller("operations")
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}
  @Post("add")
  add(dto: AddRequestDto): NumericOperationResponseDTO {
    return {
      remainingBalance: 100,
      result: 5,
    };
  }

  @Post("subtract")
  subtract(dto: SubtractRequestDto): NumericOperationResponseDTO {
    return {
      remainingBalance: 100,
      result: 5,
    };
  }

  @Post("multiply")
  multiply(dto: MultiplyRequestDto): NumericOperationResponseDTO {
    return {
      remainingBalance: 100,
      result: 5,
    };
  }

  @Post("divide")
  divide(dto: DivideRequestDto): NumericOperationResponseDTO {
    return {
      remainingBalance: 100,
      result: 5,
    };
  }

  @Post("square-root")
  squareRoot(dto: SquareRootRequestDto): NumericOperationResponseDTO {
    return {
      remainingBalance: 100,
      result: 5,
    };
  }

  @Get("random-string")
  randomString(): StringOperationResponseDTO {
    return {
      remainingBalance: 100,
      result: "asdasdsa",
    };
  }
}
