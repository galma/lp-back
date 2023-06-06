import {
  BadGatewayException,
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
import { RandomOrgClient } from "../clients/random-org.client";
import { LoggerService } from "../../src/utils/logger.service";
import { NotEnoughBalanceError } from "../../src/errors/NotEnoughBalance";
import { BadRequestError } from "../../src/errors/BadRequest";
import { NotFoundError } from "../../src/errors/NotFound";

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private operationsRepository: Repository<Operation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly randomOrgClient: RandomOrgClient,
    private readonly logger: LoggerService
  ) {}

  async add({
    number1,
    number2,
    userId,
  }: AddRequestDto): Promise<NumericOperationResponseDTO> {
    const operation = await this.getOperation(OperationType.Add);

    if (!(await this.isEnoughBalance(userId, operation.cost))) {
      throw new NotEnoughBalanceError(userId);
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
      throw new NotEnoughBalanceError(userId);
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
      throw new NotEnoughBalanceError(userId);
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
    if (number2 === 0) throw new BadRequestError();

    const operation = await this.getOperation(OperationType.Divide);

    if (!(await this.isEnoughBalance(userId, operation.cost))) {
      throw new NotEnoughBalanceError(userId);
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
      throw new NotEnoughBalanceError(userId);
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
      throw new NotEnoughBalanceError(userId);
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

    if (!user) throw new NotFoundError(`user ${userId} not found`);

    const userBalance = Number(user.balance);

    const result = userBalance >= Number(operationCost);

    return result;
  }

  async saveOperation(
    userId: string,
    operation: Operation,
    operationResult: string | number
  ): Promise<number> {
    try {
      const newBalance = await this.operationsRepository.manager.connection.transaction(
        "SERIALIZABLE", //ensure highest level of transaction isolation
        async (entityManager) => {
          const user = await entityManager.findOneBy(User, { id: userId });

          if (!user) throw new Error("invalid user");

          this.logger.info(
            `user ${userId} is trying to submit a ${operation.type} operation. Current balance: ${user.balance}. Operation cost: ${operation.cost} `
          );

          const newBalance = Number(user.balance) - Number(operation.cost);

          if (newBalance < 0) throw new NotEnoughBalanceError(userId);

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
    } catch (error) {
      this.logger.error(
        `saveOperation for user ${userId} operation ${operation} failed.`,
        error
      );
      throw error;
    }
  }
}
