import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../auth/src/lib/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FriendService } from './friends.service';

@UseGuards(AuthGuard('jwt'))
@Controller('friends')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Get('/')
  async getFriends(@CurrentUser() { userId }): Promise<any> {
    return await this.friendService.getFriends(userId);
  }

  @Post('/')
  async addFriend(@CurrentUser() { userId }, @Body() body): Promise<any> {
    //Check the body
    if (!body.friendEmail) {
      return { error: 'Missing friend' };
    }
    return await this.friendService.addFriend(userId, body.friendEmail);
  }

  @Get('/location')
  async getFriendsLocation(@CurrentUser() { userId }): Promise<any> {
    return await this.friendService.getFriendsLocation(userId);
  }
} //end CoursesController
