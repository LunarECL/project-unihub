import { Module } from '@nestjs/common';
import { WebrtcController } from './webrtc.controller';
import { EmailModule } from '@unihub/api/email';
import { AuthModule } from '@unihub/api/auth';

@Module({
  imports: [EmailModule, AuthModule],
  controllers: [WebrtcController],
  providers: [],
  exports: [],
})
export class WebrtcModule {}
