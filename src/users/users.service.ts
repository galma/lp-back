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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async signUp({
    email,
    password,
  }: SignUpRequestDto): Promise<SignInResponseDTO> {
    console.log("calling signup service");

    const initialBalance = 100;

    const result: InsertResult = await this.usersRepository.insert({
      email,
      password,
      balance: initialBalance,
    });

    return {
      userId: result.identifiers[0].id,
      remainingBalance: initialBalance,
    };
  }

  async signIn({
    email,
    password,
  }: SignUpRequestDto): Promise<SignInResponseDTO> {
    console.log("calling signin service");

    const result = await this.usersRepository.findOneBy({ email });

    if (!result) {
      throw new UnauthorizedException();
    }

    if (result.password !== password) {
      throw new UnauthorizedException();
    }

    return {
      userId: result.id,
      remainingBalance: result.balance,
    };
  }
}
