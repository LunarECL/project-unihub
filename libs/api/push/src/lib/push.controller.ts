import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import { PushService } from './push.service';
import { UserSubscription } from './types';

@Controller()
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Get('/vapid-public-key')
  getVapidPublicKey(): string {
    return this.pushService.getVapidPublicKey();
  }

  @Post('/subscription')
  saveSubscription(@Body() subscription: UserSubscription): Promise<void> {
    return this.pushService.saveSubscription(subscription);
  }

  @Delete('/subscription')
  deleteSubscription(@Body() subscription: UserSubscription): Promise<void> {
    return this.pushService.deleteSubscription(subscription);
  }

  @Post('/send-push-notification')
  sendPushNotification(
    @Body() data: { targetId: string; message: string }
  ): Promise<void> {
    const { targetId, message } = data;
    return this.pushService.sendPushNotification(targetId, message);
  }
}
