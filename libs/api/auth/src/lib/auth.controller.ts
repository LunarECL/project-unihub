import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  getUser(@CurrentUser() { email }): string {
    return email;
  }
}
