import { Injectable } from "@nestjs/common";
import { AddRequestDto } from "../dtos/add-request.dto";
import { NumericOperationResponseDTO } from "../dtos/numeric-operation-response.dto";

@Injectable()
export class OperationsService {
  async add({
    number1,
    number2,
  }: AddRequestDto): Promise<NumericOperationResponseDTO> {
    const result = number1 + number2;
    const operationResult = {
      result,
      remainingBalance: -1,
    } as NumericOperationResponseDTO;

    return operationResult;
  }
}
