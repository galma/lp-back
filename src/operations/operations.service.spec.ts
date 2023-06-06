import { createMock } from "@golevelup/ts-jest";
import { Test, TestingModule } from "@nestjs/testing";
import { OperationsController } from "./operations.controller";
import { OperationsService } from "./operations.service";
import { DivideRequestDto } from "../../src/dtos/divide-request.dto";
import { SubtractRequestDto } from "../../src/dtos/subtract-request.dto";
import { MultiplyRequestDto } from "../../src/dtos/multiply-request.dto";
import { SquareRootRequestDto } from "../../src/dtos/square-root-request.dto";
import { RandomStringRequestDto } from "../../src/dtos/random-string-request.dto";
import { NumericOperationResponseDTO } from "../../src/dtos/numeric-operation-response.dto";
import { StringOperationResponseDTO } from "../../src/dtos/string-operation-response.dto";
import { Repository } from "typeorm";
import { User } from "../../src/entities/user.entity";
import { Operation } from "../../src/entities/operation.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RandomOrgClient } from "../../src/clients/random-org.client";
import { BadRequestError } from "../../src/errors/BadRequest";

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    findOneBy: jest.fn(),
  })
);

describe("OperationsService", () => {
  let service: OperationsService;
  let operationsRepositoryMock: MockType<Repository<Operation>>;
  let userRepositoryMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationsController],
      providers: [
        OperationsService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Operation),
          useFactory: repositoryMockFactory,
        },
        {
          provide: RandomOrgClient,
          useValue: createMock<RandomOrgClient>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();
    service = module.get<OperationsService>(OperationsService);
    operationsRepositoryMock = module.get(getRepositoryToken(Operation));
    userRepositoryMock = module.get(getRepositoryToken(User));
  });

  describe("divide", () => {
    it("should perform divide operation with non 0 number 2 value and finish successfully", async () => {
      const expectedResult = new NumericOperationResponseDTO();
      expectedResult.remainingBalance = 1; //results doesn't matter
      expectedResult.result = 1; //results doesn't matter

      const dto = new DivideRequestDto();
      dto.number1 = 4;
      dto.number2 = 3;

      const divideOperation = new Operation();
      divideOperation.cost = 10;
      divideOperation.id = "118a353f-6ae1-43e8-9289-95946c2ae0e8";
      //@ts-ignore
      divideOperation.type = "Divide";

      operationsRepositoryMock.findOneBy.mockResolvedValue(
        Promise.resolve(divideOperation)
      );

      const mockedUser = new User();
      mockedUser.id = "118a353f-6ae1-43e8-9289-95946c2ae0e1";
      mockedUser.balance = 11;
      mockedUser.email = "test@yopmail.com";

      userRepositoryMock.findOneBy.mockResolvedValue(
        Promise.resolve(mockedUser)
      );

      jest
        .spyOn(service, "saveOperation")
        .mockResolvedValue(Promise.resolve(2));

      const result = await service.divide(dto);

      expect(service.divide).toHaveBeenCalledWith(dto);
      expect(result).toBe(expectedResult);
    });

    it("should fails if number 2 value is 0", async () => {
      const dto = new DivideRequestDto();
      dto.number1 = 4;
      dto.number2 = 0;

      const divideOperation = new Operation();
      divideOperation.cost = 10;
      divideOperation.id = "118a353f-6ae1-43e8-9289-95946c2ae0e8";
      //@ts-ignore
      divideOperation.type = "Divide";

      operationsRepositoryMock.findOneBy.mockResolvedValue(
        Promise.resolve(divideOperation)
      );

      const mockedUser = new User();
      mockedUser.id = "118a353f-6ae1-43e8-9289-95946c2ae0e1";
      mockedUser.balance = 11;
      mockedUser.email = "test@yopmail.com";

      userRepositoryMock.findOneBy.mockResolvedValue(
        Promise.resolve(mockedUser)
      );

      await expect(service.divide(dto)).rejects.toBeInstanceOf(BadRequestError);
    });
  });
});
