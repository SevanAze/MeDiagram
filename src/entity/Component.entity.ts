import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn
  } from "typeorm";
import { Work } from "./Work.entity";
  
  @Entity('component')
  export class Component {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    workId!: number;
  
    @Column({ nullable: true })
    parentId?: number;
  
    @Column({
      type: "enum",
      enum: ['saison', 'episode', 'arc', 'chapitre'],
      default: 'episode'
    })
    type!: 'saison' | 'episode' | 'arc' | 'chapitre';
  
    @Column()
    title!: string;
  
    @Column({ nullable: true })
    number!: number;
  
    @Column({ type: 'date', nullable: true })
    releaseDate!: Date;
  
    @ManyToOne(() => Work, work => work.component, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "work_id" })
    work!: Work;
  
    @ManyToOne(() => Component, component => component.children, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "parent_id" })
    parent!: Component;
  
    @OneToMany(() => Component, component => component.parent)
    children!: Component[];
  }
  