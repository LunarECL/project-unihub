import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('email')
export class EmailConsumer {
  constructor(private mailService: MailerService) {}

  @Process('send-welcome')
  async sendWelcomeEmail(job: Job) {
    console.log('sendWelcomeEmail ' + job?.data.email + ' ' + job?.data.name);
    await this.mailService
      .sendMail({
        to: job?.data.email,
        from: process.env.EMAIL_SNEDER,
        subject: 'Welcome to UniHub - Your One Stop for Academic Success!',
        html: `
    <p>Dear ${job.data.name},</p>
    <p>Welcome to UniHub! We are thrilled to have you join our community of students and scholars. UniHub is here to help you excel in your academic journey by connecting you with resources, peers.</p>
    <p>If you have any questions or need support, feel free to reach out to us at any time.</p>
    <p>Wishing you the best in your studies,</p>
    <p>The UniHub Team</p>
  `,
      })
      .then((info) => {
        console.log('Email sent ' + info);
      })
      .catch((error) => {
        console.log('Email error ' + error);
      });
  }

  @Process('send-invite')
  async addContributor(job: Job) {
    console.log('sendInviteEmail ' + job?.data.email + ' ' + job?.data.owner);
    await this.mailService
      .sendMail({
        to: job?.data.email,
        from: process.env.EMAIL_SNEDER,
        subject: `You're invited to join a study group on UniHub!`,
        html: `
    <p>Hello ${job.data.owner},</p>
    <p>Great news! You have been invited to join the "<strong>${job.data.groupName}</strong>" study group on UniHub.</p>
    <p>To accept the invitation and join the group, simply click on the following link: <a href="https://unihub.today/home/rooms/${job.data.groupId}">${job.data.groupName}</a></p>
    <p>Happy studying!</p>
    <p>The UniHub Team</p>
  `,
      })
      .then((info) => {
        console.log('Email sent ' + info);
      })
      .catch((error) => {
        console.log('Email error ' + error);
      });
  }
}
