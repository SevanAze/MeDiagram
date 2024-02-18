import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Work } from "./Work.entity";
import { Component } from "./Component.entity";

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

  // Relations optionnelles (non chargées par défaut)
  // Note: Ces relations sont ici à titre d'exemple, elles ne seront pas utilisées directement dans les requêtes si vous travaillez avec targetId et targetType.
  // Vous pouvez utiliser ces relations pour des opérations spécifiques où la connaissance du type est nécessaire et préchargée.
  @ManyToOne(() => Work, { nullable: true })
  @JoinColumn({ name: "targetId", referencedColumnName: "id" })
  work!: Work;

  @ManyToOne(() => Component, { nullable: true })
  @JoinColumn({ name: "targetId", referencedColumnName: "id" })
  component!: Component;

  // Ajoutez ici d'autres relations si nécessaire
}
