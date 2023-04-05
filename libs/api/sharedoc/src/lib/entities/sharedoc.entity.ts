import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lecture } from '@unihub/api/courses';
import { Op } from './ops.entity';
import { User } from '@unihub/api/auth';

@Entity()
export class ShareDoc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  lectureNumber: string; //lecture1, lecture2, lecture3, etc. (depends on the week)

  @Column({ nullable: true })
  userTitle: string; //title of the document

  @ManyToOne(() => Lecture, (lecture) => lecture.shareDoc)
  lecture: Lecture;

  @OneToMany(() => Op, (op) => op.document)
  ops: [];

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
} //end class Courses
