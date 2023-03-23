import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lecture } from '@unihub/api/courses';

@Entity()
export class User {
  @PrimaryColumn({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  email: string;
} //end class User
