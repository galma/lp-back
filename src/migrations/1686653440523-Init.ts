import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1686653440523 implements MigrationInterface {
    name = 'Init1686653440523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" ADD "deleted" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" DROP COLUMN "deleted"`);
    }

}
