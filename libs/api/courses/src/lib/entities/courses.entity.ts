import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Section } from './section.entity';

@Entity()
export class Courses {
  @PrimaryColumn({ nullable: false })
  programCode: string;

  @PrimaryColumn({ nullable: false })
  sec_cd: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  session: string;

  @UpdateDateColumn()
  updated: Date;

  @OneToMany(() => Section, (section) => section.course)
  sections: Section[];
} //end class Courses
