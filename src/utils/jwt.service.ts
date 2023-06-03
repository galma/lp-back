import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";
import { EncryptionService } from "./encryption.service";

@Injectable()
export default class JwtService {
  private readonly issuer: string;
  private readonly privateKey: string;
  private readonly publicKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService
  ) {
    this.issuer = this.configService.get("jwt.issuer");
    this.privateKey = this.configService.get("jwt.privateKey");
    this.publicKey = this.configService.get("jwt.publicKey");
  }

  signToken(tokenData: { userId: string }, encrypt = true) {
    const signOptions = {
      issuer: this.issuer,
      audience: "audience",
      expiresIn: "1h",
      algorithm: "RS256",
    };

    const token = jwt.sign(tokenData, this.privateKey, signOptions);

    return encrypt ? this.encryptionService.encryptText(token) : token;
  }

  async verifyToken(token, isEncrypted = true) {
    let verifyResult;
    try {
      verifyResult = await jwt.verify(
        isEncrypted ? this.encryptionService.decryptText(token) : token,
        this.publicKey
      );
    } catch (error) {
      //@ts-ignore
      if (error?.name === "TokenExpiredError") {
        throw new Error("JwtExpired"); //JwtExpiredError("token expired");
      } else {
        throw error;
      }
    }
    return verifyResult;
  }
}
