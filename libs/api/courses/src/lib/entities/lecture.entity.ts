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
import { Section } from './section.entity';
import { ShareDoc } from '@unihub/api/sharedoc';

@Entity()
export class Lecture {
  @PrimaryColumn({ nullable: false })
  day: string;

  @PrimaryColumn({ nullable: false })
  startTime: Date;

  @PrimaryColumn({ nullable: false })
  building: string;

  @PrimaryColumn({ nullable: false })
  room: string;

  @Column({ nullable: false })
  totalMinutes: string;

  // @Column({ nullable: false })
  @ManyToOne(() => Section, (section: Section) => section.lectures)
  section: Section;

  // @Column({ nullable: false })
  @OneToOne(() => ShareDoc, (shareDoc) => shareDoc.lecture)
  shareDoc: ShareDoc;
} //end class Courses
