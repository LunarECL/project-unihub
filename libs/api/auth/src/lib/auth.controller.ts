import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './current-user.decorator';
import { ManagementService } from '@unihub/api/auth';

@Controller('auth')
export class AuthController {
  constructor() {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  getUser(@CurrentUser() { email }): string {
    return email;
  }
}
