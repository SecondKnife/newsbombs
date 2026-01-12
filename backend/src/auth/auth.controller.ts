import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { StrictRateLimitInterceptor } from '../common/strict-rate-limit.interceptor';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(new StrictRateLimitInterceptor(5, 60000, 600000))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

