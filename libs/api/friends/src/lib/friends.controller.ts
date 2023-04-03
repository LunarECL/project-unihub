import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
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

  @Delete('/:friendId')
  async deleteFriend(
    @CurrentUser() { userId },
    @Param('friendId') friendId: string
  ): Promise<any> {
    return await this.friendService.deleteFriend(userId, friendId);
  }

  @Patch('/accept')
  async acceptFriend(@CurrentUser() { userId }, @Body() body): Promise<any> {
    //Check the body
    if (!body.friendEmail) {
      return { error: 'Missing friend' };
    }
    return await this.friendService.acceptFriendRequest(
      userId,
      body.friendEmail
    );
  }

  @Get('/requests')
  async getFriendRequests(@CurrentUser() { userId }): Promise<any> {
    return await this.friendService.getFriendRequests(userId);
  }
} //end CoursesController
