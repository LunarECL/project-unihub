import { Module } from '@nestjs/common';
import { PushController } from './push.controller';
import { PushService } from './push.service';
import { LoggerService } from './logger.service';

@Module({
  controllers: [PushController],
  providers: [PushService, LoggerService],
})
export class PushModule {}
