import { hash, compare } from "bcrypt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";

@Injectable()
export class EncryptionService {
  private algorithm: string;
  private key: Buffer | string;
  private iv: Buffer | string | null;

  constructor(private readonly configService: ConfigService) {
    this.algorithm = this.configService.get("security.encryptionAlgorithm");
    if (!this.algorithm) throw new Error("encryptionAlgorithm undefined");
    const encryptionKey = this.configService.get("security.encryptionKey");
    if (!encryptionKey) throw new Error("encryptionKey undefined");

    const ENCRYPTION_KEY = encryptionKey
      ? Buffer.from(encryptionKey).toString("hex")
      : "";
    const encryptionIV = this.configService.get("security.encryptionIV");
    const IV_KEY = encryptionIV
      ? Buffer.from(encryptionIV).toString("hex")
      : "";

    this.key = ENCRYPTION_KEY ? Buffer.from(ENCRYPTION_KEY, "hex") : "";

    this.iv = IV_KEY ? Buffer.from(IV_KEY, "hex") : null;

    if (!this.algorithm && !this.key) {
      throw Error("Configuration Error!");
    }
  }

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

  encryptText(text: string): string {
    if (!text) return "";

    const iv = this.iv || crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    const buffer = Buffer.from(text, "utf8").toString("binary");

    const firstPart = cipher.update(buffer, "binary", "hex");
    const finalPart = cipher.final("hex");
    return this.iv
      ? `${firstPart}${finalPart}`
      : `${iv.toString("hex")}${firstPart}${finalPart}`;
  }

  decryptText(textEncrypted: string): string {
    if (!textEncrypted) return "";
    const iv = this.iv || Buffer.from(textEncrypted.substring(0, 32), "hex");
    const text = this.iv ? textEncrypted : textEncrypted.slice(32);

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);

    const firstPart = decipher.update(text, "hex", "binary");
    const finalPart = decipher.final("binary") || "";

    const decrypted = `${firstPart}${finalPart}`;

    return decrypted;
  }
}
