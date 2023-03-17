import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  welcome(owner: string, email: string) {
    this.emailQueue.add('send-welcome', { owner, email });
  }

  invite(owner: string, email: string, groupName: string, groupId: string) {
    this.emailQueue.add('send-invite', { owner, email, groupName, groupId });
  }
}
