import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SignInResponseDTO } from "../../src/dtos/sign-in-response.dto";
import { SignUpRequestDto } from "src/dtos/sign-up-request.dto";
import { User } from "../../src/entities/user.entity";
import { InsertResult, Repository } from "typeorm";
import { Record } from "../../src/entities/record.entity";
import { ConfigService } from "@nestjs/config";
import { EncryptionService } from "../../src/utils/encryption.service";

@Injectable()
export class UsersService {
  private readonly initialBalance: number;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Record)
    private readonly recordsRepository: Repository<Record>,
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService
  ) {
    this.initialBalance = this.configService.get<number>(
      "user.initialBalance"
    ) as number;
  }

  async signUp({
    email,
    password,
  }: SignUpRequestDto): Promise<SignInResponseDTO> {
    console.log("calling signup service");

    const result: InsertResult = await this.usersRepository.insert({
      email,
      password: await this.encryptionService.hashPassword(password),
      balance: this.initialBalance,
    });

    return {
      userId: result.identifiers[0].id,
      remainingBalance: this.initialBalance,
    };
  }

  async signIn({
    email,
    password,
  }: SignUpRequestDto): Promise<SignInResponseDTO> {
    console.log("calling signin service");

    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (
      !(await this.encryptionService.passwordMatch(password, user.password))
    ) {
      throw new UnauthorizedException();
    }

    return {
      userId: user.id,
      remainingBalance: user.balance,
    };
  }

  async getUserRecords(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    records: Record[];
    total: number;
    totalPages: number;
    previousPage: boolean;
    nextPage: boolean;
  }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException();

    const [records, total] = await this.recordsRepository.findAndCount({
      where: { user: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
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
}
