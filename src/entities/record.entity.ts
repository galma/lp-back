import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Operation } from "./operation.entity";
import { User } from "./user.entity";

@Entity()
export class Record {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne((type) => Operation)
  @JoinColumn({ name: "operation_id" })
  operation: Operation;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column("numeric", { precision: 10, scale: 2 })
  userBalance: number;

  @Column("numeric", { precision: 10, scale: 2 })
  amount: number;

  @Column()
  operationResponse: string;

  @Column({ type: "timestamptz", default: () => "NOW()" })
  date: Date;

  @Column({ nullable: true })
  deleted: boolean;
}
