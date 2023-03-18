import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courses } from './entities/courses.entity';
import { Lecture } from './entities/lecture.entity';
import { Section } from './entities/section.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Courses]),
    TypeOrmModule.forFeature([Lecture]),
    TypeOrmModule.forFeature([Section]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoursesModule {}
