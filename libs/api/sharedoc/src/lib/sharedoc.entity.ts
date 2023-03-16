import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
//I DON'T THINK IT SHOULD BE LIKE THIS 
import { Courses } from '../../../courses/src/lib/courses.entity';

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
