import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column("numeric", { precision: 10, scale: 2 })
  balance: number;
}
