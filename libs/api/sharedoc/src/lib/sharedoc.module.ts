import { Module } from '@nestjs/common';
import { DocumentController } from './sharedoc.controller';
import { ShareDBServer } from './sharedoc.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './sharedoc.entity';
import { DocumentService } from './sharedoc.service';

@Module({
  controllers: [DocumentController],
  imports: [TypeOrmModule.forFeature([Document])],
  providers: [ShareDBServer, DocumentService],
  exports: [DocumentController],
})
export class SharedocModule {}
