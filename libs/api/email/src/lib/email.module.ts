import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bull';
import { EmailService } from './email.service';
import { EmailConsumer } from './email.consumer';
import { EmailController } from './email.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_SERVER,
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailConsumer],
  exports: [EmailService],
})
export class EmailModule {}
