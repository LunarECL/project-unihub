import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Courses } from '@unihub/api/courses'

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  content: string;

  @Column()
  lecture_number: number;

  @OneToOne(() => Courses)
  @JoinColumn({ name: 'course_id' })
  course: Courses;
}
