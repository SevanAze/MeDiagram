import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Rating } from "./Rating.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Rating, rating => rating.user)
  ratings!: Rating[];
}
