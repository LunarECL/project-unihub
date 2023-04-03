import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Friends {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  friendId: string;

  @Column({ nullable: true })
  isRequested: boolean;

  @Column({ nullable: true })
  isAccepted: boolean;
} //end class Courses
