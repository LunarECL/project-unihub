import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './sharedoc.controller';
import { ShareDBServer } from './sharedoc.gateway';
import { ShareDoc } from './entities/sharedoc.entity';
import { DocumentService } from './sharedoc.service';
import { Op } from './entities/ops.entity';
import { Attribute } from './entities/attributes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShareDoc]),
    TypeOrmModule.forFeature([Op]),
    TypeOrmModule.forFeature([Attribute]),
  ],
  controllers: [AppController],
  providers: [ShareDBServer, DocumentService],
})
export class SharedocModule {}
