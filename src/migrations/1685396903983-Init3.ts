import { MigrationInterface, QueryRunner } from "typeorm";

export class Init31685396903983 implements MigrationInterface {
    name = 'Init31685396903983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "record" ADD CONSTRAINT "FK_e28cccb0d33870ac1f81f7a727d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" DROP CONSTRAINT "FK_e28cccb0d33870ac1f81f7a727d"`);
        await queryRunner.query(`ALTER TABLE "record" DROP COLUMN "user_id"`);
    }

}
