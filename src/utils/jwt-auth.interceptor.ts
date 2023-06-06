import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import JwtService from "./jwt.service";
import { SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UnauthorizedError } from "../../src/errors/Unauthorized";
import { BadRequestError } from "../../src/errors/BadRequest";

const REQUIRES_JWT = "requiresJwt";

export const RequiresJwt = () => SetMetadata(REQUIRES_JWT, true);

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    console.log("intercept");
    const requiresJwt = this.reflector.get<boolean>(
      REQUIRES_JWT,
      context.getHandler()
    );

    if (!requiresJwt) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();

    const token = this.extractToken(request.headers["authorization"]);

    try {
      const decoded = await this.jwtService.verifyToken(token);
      //@ts-ignore
      request.user = decoded.userId;
    } catch (error) {
      throw new UnauthorizedError("Invalid token");
    }

    return next.handle();
  }

  extractToken(authorizationHeader: string): string {
    if (!authorizationHeader) {
      throw new BadRequestError("No authorization header provided");
    }

    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new BadRequestError("Invalid authorization header format");
    }

    return token;
  }
}
