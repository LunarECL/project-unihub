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
import { ShareDoc } from './sharedoc.entity';
import { Attribute } from './attributes.entity';

@Entity()
export class Op {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  insert: string;

  @Column({ nullable: true })
  retain: number;

  @ManyToOne(() => ShareDoc, (document) => document.ops)
  document: ShareDoc;

  @OneToOne(() => Attribute, (attribute) => attribute.op)
  attributes: Attribute;
} //end class Op
