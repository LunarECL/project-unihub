// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { User } from '@unihub/api/auth';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Courses } from './courses.entity';
import { Lecture } from './lecture.entity';

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  sectionType: string;

  @Column({ nullable: false })
  sectionNumber: string;

  @Column({ nullable: false })
  currentEnrollment: string;

  @Column({ nullable: false })
  maxEnrollment: string;

  @Column({ nullable: false })
  instructor: string;

  @Column({ nullable: false })
  delivery_mode: string;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => Courses, (course: Courses) => course.sections)
  course: Courses;

  //   @Column({ nullable: false })
  @OneToMany(() => Lecture, (lecture) => lecture.section)
  lectures: Lecture[];

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
} //end class Courses
