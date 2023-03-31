import { Module } from '@nestjs/common';
import { Friends } from './entities.ts/friends.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendController } from './friends.controller';
import { FriendService } from './friends.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friends])],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [],
})
export class FriendsModule {}
