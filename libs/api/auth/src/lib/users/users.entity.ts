import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn({nullable: false})
    userId: string;

    @Column({nullable: false})
    email: string;
}//end class User