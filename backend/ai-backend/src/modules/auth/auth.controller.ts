import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =========================
  // SIGNUP
  // =========================
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto.email, dto.password, dto.name);
  }

  // =========================
  // ACTIVATE ACCOUNT
  // =========================
  @Get('activate')
  activate(@Query('token') token: string) {
    return this.authService.activate(token);
  }

  // =========================
  // LOGIN
  // =========================
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  // =========================
  // FORGOT PASSWORD
  // =========================
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  // =========================
  // RESET PASSWORD
  // =========================
  @Post('reset-password')
  resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }
}
