import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // =========================
  // SIGNUP
  // =========================
  async signup(email: string, password: string, name?: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = randomBytes(32).toString('hex');

    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        activationToken,
        isActive: false,
      },
    });

    await this.mailService.sendActivationEmail(email, activationToken);

    return { message: 'Activation email sent' };
  }

  // =========================
  // ACTIVATE ACCOUNT
  // =========================
  async activate(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { activationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid activation token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true,
        activationToken: null,
      },
    });

    await this.mailService.sendRegistrationSuccess(user.email);

    return { message: 'Account activated successfully' };
  }

  // =========================
  // LOGIN
  // =========================
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account not activated');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user.id);
  }

  // =========================
  // FORGOT PASSWORD
  // =========================
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Do not reveal if email exists
    if (!user) {
      return { message: 'If the account exists, a reset email was sent' };
    }

    const rawToken = randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(rawToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 30), // 30 min
      },
    });

    await this.mailService.sendForgotPassword(email, rawToken);

    return { message: 'If the account exists, a reset email was sent' };
  }

  // =========================
  // RESET PASSWORD
  // =========================
  async resetPassword(token: string, newPassword: string) {
    const users = await this.prisma.user.findMany({
      where: {
        resetToken: { not: null },
      },
    });

    let matchedUser: User | null = null;
    for (const user of users) {
      const isMatch = await bcrypt.compare(token, user.resetToken!);
      if (isMatch && user.resetTokenExpiry! > new Date()) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: matchedUser.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    await this.mailService.sendResetSuccess(matchedUser.email);

    return { message: 'Password reset successful' };
  }

  // =========================
  // TOKEN GENERATION
  // =========================
  private generateToken(userId: string) {
    const payload = { sub: userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
