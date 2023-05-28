import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum OperationType {
  Add = "Add",
  Subtract = "Subtract",
  Divide = "Divide",
  Multiply = "Multiply",
  SquareRoot = "SquareRoot",
  RandomString = "RandomString",
}

@Entity()
export class Operation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: OperationType,
    unique: true,
  })
  type: OperationType[];

  @Column("numeric", { precision: 10, scale: 2 })
  cost: number;
}
