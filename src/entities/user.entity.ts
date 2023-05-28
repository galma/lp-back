import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("numeric", { precision: 10, scale: 2 })
  balance: number;

  @Column()
  description: string;
}
