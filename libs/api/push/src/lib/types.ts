import { PushSubscription } from 'web-push';

export interface UserSubscription {
  userId: string;
  subscription: PushSubscription;
}

export interface Store {
  data: UserSubscription[];
}

export interface PushMessage {
  title: string;
  body: string;
}
