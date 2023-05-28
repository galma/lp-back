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
    const operationCost = await this.getOperationCost(OperationType.Add);

    if (!(await this.isEnoughBalance(userId, operationCost))) {
      throw new ForbiddenException("not enough balance");
    }

    const newBalance = await this.consumeBalanceAndSaveRecord(
      userId,
      operationCost
    );

    const result = number1 + number2;
    const operationResult = {
      result,
      remainingBalance: newBalance,
    } as NumericOperationResponseDTO;

    return operationResult;
  }

  async getOperationCost(operationType: OperationType): Promise<number> {
    const operation = await this.operationsRepository.findOneBy({
      type: operationType,
    });

    if (!operation) throw new Error();

    return Number(operation.cost);
  }

  async isEnoughBalance(userId: string, operationCost: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error();

    const userBalance = Number(user.balance);

    console.log(userBalance >= operationCost);

    return userBalance >= operationCost;
  }

  async consumeBalanceAndSaveRecord(
    userId: string,
    amount: number
  ): Promise<number> {
    const newBalance = await this.operationsRepository.manager.connection.transaction(
      "SERIALIZABLE", //ensure highest level of transaction isolation
      async (entityManager) => {
        const user = await entityManager.findOneBy(User, { id: userId });

        if (!user) throw new Error("invalid user");

        const newBalance = Number(user.balance) - amount;

        if (newBalance < 0) throw new Error("inssuficient balance");

        await entityManager.update(
          User,
          { id: userId },
          { balance: newBalance }
        );

        return newBalance;
      }
    );

    return newBalance;
  }
}
