import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './sharedoc.controller';
import { ShareDBServer } from './sharedoc.gateway';
import { ShareDoc } from './sharedoc.entity';
import { DocumentService } from './sharedoc.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShareDoc])],
  controllers: [AppController],
  providers: [ShareDBServer, DocumentService],
})
export class SharedocModule {}