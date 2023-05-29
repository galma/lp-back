import { MigrationInterface, QueryRunner } from "typeorm";
import { OperationType } from "src/entities/operation.entity";

export class Init1685366380089 implements MigrationInterface {
  name = "Init1685366380089";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."operation_type_enum" AS ENUM('Add', 'Subtract', 'Divide', 'Multiply', 'SquareRoot', 'RandomString')`
    );
    await queryRunner.query(
      `CREATE TABLE "operation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."operation_type_enum" NOT NULL, "cost" numeric(10,2) NOT NULL, CONSTRAINT "UQ_cd0195651a1f3814d39050c74f4" UNIQUE ("type"), CONSTRAINT "PK_18556ee6e49c005fc108078f3ab" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userBalance" numeric(10,2) NOT NULL, "amount" numeric(10,2) NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "operation_id" uuid, CONSTRAINT "PK_5cb1f4d1aff275cf9001f4343b9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "balance" numeric(10,2) NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "record" ADD CONSTRAINT "FK_dfb4a21d5021ce5c510d4855ed1" FOREIGN KEY ("operation_id") REFERENCES "operation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    let cost = 0;

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into("operation")
      .values(
        Object.keys(OperationType).map((x) => {
          cost = cost + 0.5;
          return {
            type: OperationType[x],
            cost,
          };
        })
      )
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "record" DROP CONSTRAINT "FK_dfb4a21d5021ce5c510d4855ed1"`
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "record"`);
    await queryRunner.query(`DROP TABLE "operation"`);
    await queryRunner.query(`DROP TYPE "public"."operation_type_enum"`);
  }
}
