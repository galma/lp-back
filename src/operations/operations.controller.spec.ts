import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { Test, TestingModule } from "@nestjs/testing";
import { OperationsController } from "./operations.controller";
import { OperationsService } from "./operations.service";
import { AddRequestDto } from "../../src/dtos/add-request.dto";
import { SubtractRequestDto } from "../../src/dtos/subtract-request.dto";
import { MultiplyRequestDto } from "../../src/dtos/multiply-request.dto";
import { DivideRequestDto } from "../../src/dtos/divide-request.dto";
import { SquareRootRequestDto } from "../../src/dtos/square-root-request.dto";
import { RandomStringRequestDto } from "../../src/dtos/random-string-request.dto";
import { NumericOperationResponseDTO } from "../../src/dtos/numeric-operation-response.dto";
import { StringOperationResponseDTO } from "../../src/dtos/string-operation-response.dto";
import { Repository } from "typeorm";
import { User } from "../../src/entities/user.entity";
import { Operation } from "../../src/entities/operation.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RandomOrgClient } from "../../src/clients/random-org.client";

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
  })
);

describe("OperationsController", () => {
  let controller: OperationsController;
  let service: OperationsService;

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

    controller = module.get<OperationsController>(OperationsController);
    service = module.get<OperationsService>(OperationsService);
  });

  describe("add", () => {
    it("should call operationsService.add and return the result", async () => {
      const expectedResult = new NumericOperationResponseDTO();
      expectedResult.remainingBalance = 5;
      expectedResult.result = 3;

      const dto = new AddRequestDto();
      dto.number1 = 1;
      dto.number2 = 2;
      jest
        .spyOn(service, "add")
        .mockResolvedValue(Promise.resolve(expectedResult));

      const result = await controller.add(dto);

      expect(service.add).toHaveBeenCalledWith(dto);
      expect(result).toBe(expectedResult);
    });
  });
});
