import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from '@unihub/api/email';
import { CurrentUser } from '../../../auth/src/lib/current-user.decorator';
import { ManagementService } from '@unihub/api/auth';

@Controller('email')
export class EmailController {
  constructor(
    private emailService: EmailService,
    private managementService: ManagementService
  ) {}
  @Post('invitation')
  async sendInvitation(
    @CurrentUser() { userId },
    @Body() body: { email: string; groupName: string; groupId: string }
  ) {
    const { email, groupName, groupId } = body;
    const data = await this.managementService.getIdpAccessToken(userId);
    const name = data.data.name;
    this.emailService.invite(name, email, groupName, groupId);
  }
}
