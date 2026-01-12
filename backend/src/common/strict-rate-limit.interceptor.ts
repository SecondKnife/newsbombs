import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    blockedUntil?: number;
  };
}

@Injectable()
export class StrictRateLimitInterceptor implements NestInterceptor {
  private store: RateLimitStore = {};
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly blockDurationMs: number;
  private readonly cleanupInterval: number;

  constructor(
    maxRequests: number = 10,
    windowMs: number = 60000,
    blockDurationMs: number = 300000,
  ) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.blockDurationMs = blockDurationMs;
    this.cleanupInterval = 300000;

    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = this.getKey(request);

    const now = Date.now();
    const record = this.store[key];

    if (record?.blockedUntil && now < record.blockedUntil) {
      const remainingBlockTime = Math.ceil((record.blockedUntil - now) / 1000);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `IP temporarily blocked due to suspicious activity. Try again in ${remainingBlockTime} seconds`,
          retryAfter: remainingBlockTime,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (!record || now > record.resetTime) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
      return next.handle();
    }

    if (record.count >= this.maxRequests) {
      record.blockedUntil = now + this.blockDurationMs;
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Too many requests. IP blocked for ${Math.ceil(this.blockDurationMs / 1000)} seconds`,
          retryAfter: Math.ceil(this.blockDurationMs / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.count++;

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const remaining = this.maxRequests - record.count;
        const resetTime = Math.ceil((record.resetTime - now) / 1000);
        response.setHeader('X-RateLimit-Limit', this.maxRequests);
        response.setHeader('X-RateLimit-Remaining', Math.max(0, remaining));
        response.setHeader('X-RateLimit-Reset', resetTime);
      }),
    );
  }

  private getKey(request: any): string {
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';
    const path = request.path || request.url;
    return `${ip}:${path}`;
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      const record = this.store[key];
      if (
        (!record.blockedUntil || record.blockedUntil < now) &&
        record.resetTime < now
      ) {
        delete this.store[key];
      }
    });
  }
}
