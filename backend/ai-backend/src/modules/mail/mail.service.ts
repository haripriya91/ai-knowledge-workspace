import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend = new Resend(process.env.MAIL_API_KEY);

  async sendEmail(to: string, subject: string, html: string) {
    await this.resend.emails.send({
      from: process.env.MAIL_FROM!,
      to,
      subject,
      html,
    });
  }

  // 1️⃣ Initial registration email with activation link
  async sendActivationEmail(email: string, token: string) {
    const activationLink = `${process.env.FRONTEND_URL}/activate?token=${token}`;

    const html = `
      <h2>Activate Your Account</h2>
      <p>Click below to activate:</p>
      <a href="${activationLink}">Activate Account</a>
    `;

    await this.sendEmail(email, 'Activate your account', html);
  }

  // 2️⃣ Registration success
  async sendRegistrationSuccess(email: string) {
    const html = `
      <h2>Registration Successful</h2>
      <p>Your account is now active.</p>
    `;

    await this.sendEmail(email, 'Welcome!', html);
  }

  // 3️⃣ Forgot password
  async sendForgotPassword(email: string, token: string) {
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const html = `
      <h2>Password Reset</h2>
      <p>Click below to reset password:</p>
      <a href="${link}">Reset Password</a>
    `;

    await this.sendEmail(email, 'Reset your password', html);
  }

  // 4️⃣ Password reset confirmation
  async sendResetSuccess(email: string) {
    const html = `
      <h2>Password Updated</h2>
      <p>Your password has been successfully reset.</p>
    `;

    await this.sendEmail(email, 'Password changed', html);
  }
}
