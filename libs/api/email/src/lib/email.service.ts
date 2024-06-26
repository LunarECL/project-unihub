import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  welcome(email: string, name: string) {
    this.emailQueue.add('send-welcome', { email, name });
  }

  invite(owner: string, email: string, groupName: string, groupId: string) {
    this.emailQueue.add('send-invite', { owner, email, groupName, groupId });
  }
}
