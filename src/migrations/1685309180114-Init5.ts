import { MigrationInterface, QueryRunner } from "typeorm";

export class Init51685309180114 implements MigrationInterface {
    name = 'Init51685309180114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operation" ADD CONSTRAINT "UQ_cd0195651a1f3814d39050c74f4" UNIQUE ("type")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operation" DROP CONSTRAINT "UQ_cd0195651a1f3814d39050c74f4"`);
    }

}
