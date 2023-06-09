import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SignInResponseDTO } from "../../src/dtos/sign-in-response.dto";
import { SignUpRequestDto } from "src/dtos/sign-up-request.dto";
import { User } from "../../src/entities/user.entity";
import { EntityNotFoundError, InsertResult, Repository } from "typeorm";
import { Record } from "../../src/entities/record.entity";
import { ConfigService } from "@nestjs/config";
import { EncryptionService } from "../../src/utils/encryption.service";
import JwtService from "../../src/utils/jwt.service";
import { LoggerService } from "../../src/utils/logger.service";
import { NotFoundError } from "../../src/errors/NotFound";
import { UserAlreadyExistsError } from "../../src/errors/UserAlreadyExists";
import { InvalidCredentialsError } from "../../src/errors/InvalidCredentials";
import { ForbiddenError } from "../../src/errors/Forbidden";
import { BadRequestError } from "../../src/errors/BadRequest";

@Injectable()
export class UsersService {
  private readonly initialBalance: number;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Record)
    private readonly recordsRepository: Repository<Record>,
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService
  ) {
    this.initialBalance = this.configService.get<number>(
      "user.initialBalance"
    ) as number;
  }

  async signUp({
    email,
    password,
  }: SignUpRequestDto): Promise<SignInResponseDTO> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) throw new UserAlreadyExistsError("user already exists");

    const result: InsertResult = await this.usersRepository.insert({
      email,
      password: await this.encryptionService.hashPassword(password),
      balance: this.initialBalance,
    });

    const token = this.jwtService.signToken({
      userId: result.identifiers[0].id,
    });

    this.logger.info(
      `user with id ${result.identifiers[0].id} has been created for ${email}`
    );

    return {
      user: {
        id: result.identifiers[0].id,
        remainingBalance: this.initialBalance,
      },
      token,
    };
  }

  async signIn({
    email,
    password,
  }: SignUpRequestDto): Promise<SignInResponseDTO> {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (
      !(await this.encryptionService.passwordMatch(password, user.password))
    ) {
      throw new InvalidCredentialsError();
    }

    const token = this.jwtService.signToken({ userId: user.id });

    return {
      user: {
        id: user.id,
        remainingBalance: user.balance,
      },
      token,
    };
  }

  async getUserData(userId: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundError();

    return {
      id: user.id,
      remainingBalance: user.balance,
    };
  }

  async getUserRecords(
    userId: string,
    page: number,
    limit: number,
    rawOrderBy: string
  ): Promise<{
    records: Record[];
    total: number;
    totalPages: number;
    previousPage: boolean;
    nextPage: boolean;
  }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    const ordering = this.getOrderClause(rawOrderBy);

    if (!user) throw new NotFoundError();

    const [records, total] = await this.recordsRepository.findAndCount({
      where: { user: { id: userId }, deleted: false },
      skip: (page - 1) * limit,
      take: limit,
      ...(ordering && { order: { ...ordering } }),
    });

    const totalPages = Math.ceil(total / limit);
    const previousPage = page > 1;
    const nextPage = page < totalPages;

    return {
      records,
      total,
      totalPages,
      previousPage,
      nextPage,
    };
  }

  async deleteUserRecord(userId: string, recordId: string) {
    try {
      const record = await this.recordsRepository.findOneOrFail({
        where: { id: recordId, user: { id: userId }, deleted: false },
      });
      record.deleted = true;
      await this.recordsRepository.save(record);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundError("Record not found");
      }
      throw error;
    }
  }

  assertUserPermissions(accessedUserId, requestUser) {
    if (accessedUserId !== requestUser) {
      this.logger.warn(
        `User ${requestUser} is trying to access or perform operations for ${accessedUserId} user. Access denied.`
      );
      throw new ForbiddenError();
    }
  }

  getOrderClause(rawOrderBy: string) {
    if (!rawOrderBy) return null;

    const options = rawOrderBy.split("-");
    if (options.length != 2)
      throw new BadRequestError("invalid order by format");

    const sortClause = {
      [options[0]]: options[1] === "true" ? "DESC" : "ASC",
    };

    return sortClause;
  }
}
