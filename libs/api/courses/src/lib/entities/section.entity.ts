import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Courses } from './courses.entity';
import { Lecture } from './lecture.entity';

@Entity()
export class Section {
  @PrimaryColumn({ nullable: false })
  sectionType: string;

  @PrimaryColumn({ nullable: false })
  sectionNumber: string;

  @Column({ nullable: false })
  currentEnrollment: string;

  @Column({ nullable: false })
  instructor: string;

  @Column({ nullable: false })
  delivery_mode: string;

  @ManyToOne(() => Courses, (course: Courses) => course.sections)
  course: Courses;

  //   @Column({ nullable: false })
  @OneToMany(() => Lecture, (lecture) => lecture.section)
  lectures: Lecture[];
} //end class Courses
