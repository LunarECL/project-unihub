import { Module } from '@nestjs/common';
import { AppController } from './sharedoc.controller';
import { ShareDBServer } from './sharedoc.gateway';

@Module({
  controllers: [AppController],
  providers: [ShareDBServer],
})
export class SharedocModule {}
