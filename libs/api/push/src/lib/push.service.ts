import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import webpush, { PushSubscription } from 'web-push';
import { DATA_PATH, VAPID_PUBLIC, VAPID_PRIVATE } from './constants';
import { UserSubscription, PushMessage } from './types';
import { LoggerService } from './logger.service';

@Injectable()
export class PushService {
  constructor(private readonly logger: LoggerService) {
    webpush.setVapidDetails(
      'mailto:test@example.com',
      VAPID_PUBLIC,
      VAPID_PRIVATE
    );
  }

  getVapidPublicKey(): string {
    return VAPID_PUBLIC;
  }

  async saveSubscription(subscription: UserSubscription): Promise<void> {
    const { userId } = subscription;

    const data: UserSubscription[] = JSON.parse(
      readFileSync(DATA_PATH, 'utf-8')
    );
    const index = data.findIndex((item) => item.userId === userId);

    if (index === -1) {
      data.push(subscription);
    } else {
      data[index] = subscription;
    }

    const newData = JSON.stringify(data);
    writeFileSync(DATA_PATH, newData, 'utf-8');
  }

  async deleteSubscription(subscription: UserSubscription): Promise<void> {
    const { userId } = subscription;

    const data: UserSubscription[] = JSON.parse(
      readFileSync(DATA_PATH, 'utf-8')
    );
    const index = data.findIndex((item) => item.userId === userId);

    if (index !== -1) {
      data.splice(index, 1);
    }

    const newData = JSON.stringify(data);
    writeFileSync(DATA_PATH, newData, 'utf-8');
  }

  async sendPushNotification(
    targetUserId: string,
    message: string
  ): Promise<void> {
    const data: UserSubscription[] = JSON.parse(
      readFileSync(DATA_PATH, 'utf-8')
    );

    const targetUser = data.find((item) => item.userId === targetUserId);

    if (!targetUser) {
      throw new Error(`Cannot find user with ID ${targetUserId}`);
    }

    const messageData: PushMessage = {
      title: 'Web Push | Getting Started',
      body: message || '(Empty message)',
    };

    try {
      const pushServiceRes = await webpush.sendNotification(
        targetUser.subscription,
        JSON.stringify(messageData)
      );
      this.logger.info(
        `Push notification sent to user ${targetUserId}, status code: ${pushServiceRes.statusCode}`
      );
    } catch (error) {
      this.logger.error(
        `Failed to send push notification to user ${targetUserId}: ${error.message}`
      );
      throw error;
    }
  }
}
