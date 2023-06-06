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

const REQUIRES_JWT = "requiresJwt";

export const RequiresJwt = () => SetMetadata(REQUIRES_JWT, true);

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {
    console.log("JwtInterceptor");
  }

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
      throw new BadRequestException("Invalid token");
    }

    return next.handle();
  }

  extractToken(authorizationHeader: string): string {
    if (!authorizationHeader) {
      throw new BadRequestException("No authorization header provided");
    }

    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new BadRequestException("Invalid authorization header format");
    }

    return token;
  }
}
