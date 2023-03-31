import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Friends {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  friendId: string;
} //end class Courses
