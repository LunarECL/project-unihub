import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Section } from './section.entity';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ShareDoc } from '@unihub/api/sharedoc';

@Entity()
export class Lecture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  day: number;

  @Column({ nullable: false })
  startTime: Date;

  @Column({ nullable: false })
  totalMinutes: number;

  @Column({ nullable: false })
  building: string;

  @Column({ nullable: false })
  room: string;

  @UpdateDateColumn()
  updated: Date;

  // @Column({ nullable: false })
  @ManyToOne(() => Section, (section: Section) => section.lectures)
  section: Section;

  // @Column({ nullable: false })
  @OneToMany(() => ShareDoc, (shareDoc) => shareDoc.lecture)
  shareDoc: [];
} //end class Courses
