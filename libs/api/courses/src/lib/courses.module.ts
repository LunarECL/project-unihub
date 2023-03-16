import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courses } from './courses.entity';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

@Module({
  controllers: [CoursesController],
  imports: [TypeOrmModule.forFeature([Courses])],
  providers: [CoursesService],
  exports: [CoursesController],
})
export class ApiCoursesModule {}
