import { Module } from '@nestjs/common';
import { DocumentController } from './sharedoc.controller';
import { ShareDBServer } from './sharedoc.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './sharedoc.entity';
import { DocumentService } from './sharedoc.service';
import { ApiCoursesModule } from '@unihub/api/courses';

@Module({
  controllers: [DocumentController],
  imports: [TypeOrmModule.forFeature([Document]), ApiCoursesModule],
  providers: [ShareDBServer, DocumentService, DocumentController],
  exports: [DocumentController],
})
export class SharedocModule {}