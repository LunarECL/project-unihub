import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Section } from './section.entity';

@Entity()
export class Courses {
    @PrimaryColumn({nullable: false})
    programCode: string;

    @PrimaryColumn({nullable: false})
    courseLevel: string;

    @PrimaryColumn({nullable: false})
    courseNumber: string;

    @Column({nullable: false})
    tite: string;

    @Column({nullable: false})
    sec_cd: string;

    @Column({nullable: false})
    sesision: string;

    @OneToMany(() => Section, section => section.course)
    sections: Section[];

}//end class Courses