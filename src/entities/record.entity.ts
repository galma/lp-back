import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Operation } from "./operation.entity";

@Entity()
export class Record {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne((type) => Operation)
  @JoinColumn({ name: "operation_id" })
  operation: Operation;

  @Column("numeric", { precision: 10, scale: 2 })
  userBalance: number;

  @Column("numeric", { precision: 10, scale: 2 })
  amount: number;

  operationResponse: string;

  @Column({ type: "timestamptz", default: () => "NOW()" })
  date: Date;
}
