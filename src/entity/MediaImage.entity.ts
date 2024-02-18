// src/entity/MediaImage.ts
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Work } from "./Work.entity";

@Entity('mediaimage')
export class MediaImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  image_type!: string;

  @Column()
  image_path!: string;

  @OneToOne(() => Work, (work) => work.mediaImage)
  work!: Work;
}
