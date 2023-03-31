import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EmailService } from '@unihub/api/email';
import { CurrentUser, ManagementService } from '@unihub/api/auth';
import { AuthGuard } from '@nestjs/passport';

@Controller('email')
export class WebrtcController {
  constructor(
    private emailService: EmailService,
    private managementService: ManagementService
  ) {}

  @Post('invitation')
  @UseGuards(AuthGuard('jwt'))
  async sendInvitation(
    @Body() body: { email: string; groupName: string; groupId: string },
    @CurrentUser() { userId }
  ) {
    const { email, groupName, groupId } = body;
    const data = await this.managementService.getIdpAccessToken(userId);
    const name = data.data.name;
    this.emailService.invite(name, email, groupName, groupId);
    return { message: 'Invitation sent' };
  }
}
