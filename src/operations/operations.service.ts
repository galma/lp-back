import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { AddRequestDto } from "../dtos/add-request.dto";
import { NumericOperationResponseDTO } from "../dtos/numeric-operation-response.dto";
import { Operation, OperationType } from "../entities/operation.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { Record } from "../entities/record.entity";
import { SubtractRequestDto } from "../dtos/subtract-request.dto";
import { MultiplyRequestDto } from "../dtos/multiply-request.dto";
import { DivideRequestDto } from "../dtos/divide-request.dto";
import { SquareRootRequestDto } from "../dtos/square-root-request.dto";
import { StringOperationResponseDTO } from "../dtos/string-operation-response.dto";
import { RandomStringRequestDto } from "../dtos/random-string-request.dto";
import { RandomOrgClient } from "../client/random-org.client";

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private operationsRepository: Repository<Operation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly randomOrgClient: RandomOrgClient
  ) {}

  async add({
    number1,
    number2,
    userId,
  }: AddRequestDto): Promise<NumericOperationResponseDTO> {
    const operation = await this.getOperation(OperationType.Add);

    if (!(await this.isEnoughBalance(userId, operation.cost))) {
      throw new ForbiddenException("not enough balance");
    }

    const operationResult = number1 + number2;

    const newBalance = await this.saveOperation(
      userId,
      operation,
      operationResult
    );

    const response = {
      result: operationResult,
      remainingBalance: newBalance,
    } as NumericOperationResponseDTO;

    return response;
  }

  async subtract({
    number1,
    number2,
    userId,
  }: SubtractRequestDto): Promise<NumericOperationResponseDTO> {
    const operation = await this.getOperation(OperationType.Subtract);

    if (!(await this.isEnoughBalance(userId, operation.cost))) {
      throw new ForbiddenException("not enough balance");
    }

    const operationResult = number1 - number2;

    const newBalance = await this.saveOperation(
      userId,
      operation,
      operationResult
    );

    const response = {
      result: operationResult,
      remainingBalance: newBalance,
    } as NumericOperationResponseDTO;

    return response;
  }

  async multiply({
    number1,
    number2,
    userId,
  }: MultiplyRequestDto): Promise<NumericOperationResponseDTO> {
    const operation = await this.getOperation(OperationType.Multiply);

    if (!(await this.isEnoughBalance(userId, operation.cost))) {
      throw new ForbiddenException("not enough balance");
    }

    const operationResult = number1 * number2;

    const newBalance = await this.saveOperation(
      userId,
      operation,
      operationResult
    );

    const response = {
      result: operationResult,
      remainingBalance: newBalance,
    } as NumericOperationResponseDTO;

    return response;
  }

  async divide({
    number1,
    number2,
    userId,
  }: DivideRequestDto): Promise<NumericOperationResponseDTO> {
    if (number2 === 0) throw new BadRequestException();

    const operation = await this.getOperation(OperationType.Divide);

    if (!(await this.isEnoughBalance(userId, operation.cost))) {
      throw new ForbiddenException("not enough balance");
    }

    const operationResult = number1 / number2;

    const newBalance = await this.saveOperation(
      userId,
      operation,
      operationResult
    );

    const response = {
      result: operationResult,
      remainingBalance: newBalance,
    } as NumericOperationResponseDTO;

    return response;
  }

  async squareRoot({
    number1,
    userId,
  }: SquareRootRequestDto): Promise<NumericOperationResponseDTO> {
    if (number1 < 0) throw new BadRequestException();

    const operation = await this.getOperation(OperationType.Divide);

    if (!(await this.isEnoughBalance(userId, operation.cost))) {
      throw new ForbiddenException("not enough balance");
    }

    const operationResult = Math.sqrt(number1);

    const newBalance = await this.saveOperation(
      userId,
      operation,
      operationResult
    );

    const response = {
      result: operationResult,
      remainingBalance: newBalance,
    } as NumericOperationResponseDTO;

    return response;
  }

  async randomString({
    userId,
  }: RandomStringRequestDto): Promise<StringOperationResponseDTO> {
    const operation = await this.getOperation(OperationType.RandomString);

    if (!(await this.isEnoughBalance(userId, operation.cost))) {
      throw new ForbiddenException("not enough balance");
    }

    const operationResult = await this.randomOrgClient.getRandomString();

    const newBalance = await this.saveOperation(
      userId,
      operation,
      operationResult
    );

    const response = {
      result: operationResult,
      remainingBalance: newBalance,
    } as StringOperationResponseDTO;

    return response;
  }

  async getOperation(operationType: OperationType): Promise<Operation> {
    const operation = await this.operationsRepository.findOneBy({
      type: operationType,
    });

    if (!operation) throw new Error();

    return operation;
  }

  async isEnoughBalance(userId: string, operationCost: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error();

    const userBalance = Number(user.balance);

    return userBalance >= Number(operationCost);
  }

  async saveOperation(
    userId: string,
    operation: Operation,
    operationResult: string | number
  ): Promise<number> {
    const newBalance = await this.operationsRepository.manager.connection.transaction(
      "SERIALIZABLE", //ensure highest level of transaction isolation
      async (entityManager) => {
        const user = await entityManager.findOneBy(User, { id: userId });

        if (!user) throw new Error("invalid user");

        const newBalance = Number(user.balance) - Number(operation.cost);

        if (newBalance < 0) throw new Error("inssuficient balance");

        await entityManager.update(
          User,
          { id: userId },
          { balance: newBalance }
        );

        await entityManager.insert(Record, {
          operation: { id: operation.id },
          userBalance: user.balance,
          amount: operation.cost,
          operationResponse: operationResult as string,
          user: { id: user.id },
        });

        return newBalance;
      }
    );

    return newBalance;
  }
}
