import { Module } from '@nestjs/common';
import { AppMailerService } from './mailer.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        },
        defaults: {
          from: `"Shopie" <${process.env.EMAIL_USER}>`,
        },
        template: {
          dir: __dirname + '/../../templates',
          adapter: new (require('@nestjs-modules/mailer/dist/adapters/ejs.adapter').EjsAdapter)(),
          options: {
            strict: false,
          },
        },
      }),
    }),
    PrismaModule,
  ],
  providers: [AppMailerService],
  exports: [AppMailerService],
})
export class MailerModule {}
