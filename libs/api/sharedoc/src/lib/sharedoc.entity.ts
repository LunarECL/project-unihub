import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lecture } from '@unihub/api/courses';

@Entity()
export class ShareDoc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: false })
  lectureNumber: string; //lecture1, lecture2, lecture3, etc. (depends on the week)

  // @Column({ nullable: false })
  @ManyToOne(() => Lecture, (lecture) => lecture.shareDoc)
  lecture: Lecture;
} //end class Courses
