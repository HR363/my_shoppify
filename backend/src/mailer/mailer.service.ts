import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AppMailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  async sendPasswordReset(email: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: './reset-password', // assumes a template exists
      context: {
        resetUrl,
      },
      text: `Reset your password: ${resetUrl}`,
    });
  }

  async sendOrderConfirmation(email: string, order: { items: any[]; total: number }) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Order Confirmation',
      template: './order-confirmation',
      context: {
        items: order.items,
        total: order.total,
      },
      text: `Thank you for your order! Total: $${order.total}`,
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Shopie!',
      template: './welcome',
      context: { name },
      text: `Welcome to Shopie, ${name}!`,
    });
  }
}
