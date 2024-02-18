import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { MediaImage } from "./MediaImage.entity";
import { Component } from "./Component.entity";

export enum WorkType {
  TVShow = "serie_tv",
  Manga = "manga",
  BookSaga = "book_saga",
  Movie = "movie",
}

@Entity('work') // Assurez-vous que le nom de l'entité correspond à votre table dans la base de données
export class Work {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({
    type: "enum",
    enum: WorkType,
  })
  type!: WorkType;

  @Column()
  description!: string;

  @Column()
  releaseYear!: number;

  @Column()
  genre!: number;

  @OneToOne(() => MediaImage, mediaImage => mediaImage.work, { eager: true })
  @JoinColumn({ name: "mediaImageId" })
  mediaImage!: MediaImage;

  // Relation OneToMany avec Component
  @OneToMany(() => Component, component => component.work, { cascade: true })
  component!: Component[];
}