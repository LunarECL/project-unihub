import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courses } from './entities/courses.entity';
import { Lecture } from './entities/lecture.entity';
import { Section } from './entities/section.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CronService } from './cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Courses]),
    TypeOrmModule.forFeature([Lecture]),
    TypeOrmModule.forFeature([Section]),
    ScheduleModule.forRoot(),
  ],
  controllers: [CoursesController],
  providers: [Lecture, Section, Courses, CoursesService, CronService],
  exports: [Lecture, Section, Courses],
})
export class CoursesModule {}
