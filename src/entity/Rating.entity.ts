import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Work } from "./Work.entity";
import { Component } from "./Component.entity";
import { User } from "./User.entity";

@Entity('rating')
export class Rating {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  rating!: number;

  // Colonne générique pour l'ID du target (Work, Episode, etc.)
  @Column()
  work_id?: number;

  @Column()
  component_id?: number;

  @Column()
  comment?: string

  @Column()
  user_id!: number;

  @CreateDateColumn({ type: 'timestamp' })
  date!: Date;

  @JoinColumn({ name: "work_id", referencedColumnName: "id" })
  work!: Work;

  @ManyToOne(() => Component, { nullable: true })
  @JoinColumn({ name: "component_id", referencedColumnName: "id" })
  component!: Component;

  @ManyToOne(() => User, user => user.ratings, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user!: User;

  // Ajoutez ici d'autres relations si nécessaire
}
