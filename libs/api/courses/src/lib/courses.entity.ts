import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity()
export class Courses {
  @PrimaryGeneratedColumn({name: 'course_id'})
  id: string;

  @Column()
  course_name: string;

  @Column()
  course_code: string;

  @Column()
  description: string;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column()
  day: string;

  @Column()
  proffessor: string;

  @Column()
  lecture_room: string;

  @Column()
  faculty: string;

  @Column()
  department: string;

  @Column()
  course_type: string;

  @Column()
  course_level: string;
}
