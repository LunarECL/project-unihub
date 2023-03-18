import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Section } from './section.entity';

@Entity()
export class Lecture {
    @PrimaryColumn({nullable: false})
    day: string;

    @PrimaryColumn({nullable: false})
    startTime: Date;

    @PrimaryColumn({nullable: false})
    building: string;

    @PrimaryColumn({nullable: false})
    room: string;

    @Column({nullable: false})
    totalMinutes: string;

    @ManyToOne(() => Section, (section: Section) => section.lectures)
    section: Section;


}//end class Courses