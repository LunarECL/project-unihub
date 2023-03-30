import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';

  
  @Entity()
  export class Location {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: false })
    latitude: string;
  
    @Column({ nullable: false })
    longitude: string;
  
    @UpdateDateColumn()
    updated: Date;
  
    @Column({ nullable: false })
    userId: string;
  } //end class Courses
  