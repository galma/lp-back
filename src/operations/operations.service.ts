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

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private operationsRepository: Repository<Operation>,
    @InjectRepository(User)
    private userRepository: Repository<User>
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

    const result = number1 + number2;
    const response = {
      result,
      remainingBalance: newBalance,
    } as NumericOperationResponseDTO;

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
        });

        return newBalance;
      }
    );

    return newBalance;
  }
}
