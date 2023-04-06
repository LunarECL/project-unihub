import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Op } from './ops.entity';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bold: boolean;

  @Column({ nullable: true })
  italic: boolean;

  @Column({ nullable: true })
  underline: boolean;

  @Column({ nullable: true })
  list: string; //bullet, list

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  header: number; //h1, h2, h3, h4, h5, h6

  @OneToOne(() => Op, (op) => op.attributes)
  @JoinColumn({ name: 'op_id' })
  op: Op;
} //end class Courses
