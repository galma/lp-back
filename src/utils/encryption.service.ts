import { hash, compare } from "bcrypt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EncryptionService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
  }

  async passwordMatch(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const isMatch = await compare(password, hashedPassword);
    return isMatch;
  }
}
