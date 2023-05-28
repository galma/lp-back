import { OperationType } from "src/entities/operation.entity";
import { MigrationInterface, QueryResult, QueryRunner } from "typeorm";

export class Init41685305814667 implements MigrationInterface {
  name = "Init41685305814667";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."operation_type_enum" AS ENUM('Add', 'Subtract', 'Divide', 'Multiply', 'SquareRoot', 'RandomString')`
    );
    await queryRunner.query(
      `CREATE TABLE "operation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."operation_type_enum" NOT NULL, "cost" numeric(10,2) NOT NULL, CONSTRAINT "PK_18556ee6e49c005fc108078f3ab" PRIMARY KEY ("id"))`
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
    await queryRunner.query(`DROP TABLE "operation"`);
    await queryRunner.query(`DROP TYPE "public"."operation_type_enum"`);
  }
}
