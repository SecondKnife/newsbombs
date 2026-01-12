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
  };
}

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private store: RateLimitStore = {};
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly cleanupInterval: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.cleanupInterval = 300000;

    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = this.getKey(request);

    const now = Date.now();
    const record = this.store[key];

    if (!record || now > record.resetTime) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
      return next.handle();
    }

    if (record.count >= this.maxRequests) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests, please try again later',
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
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
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }
}
