import { MigrationInterface, QueryRunner } from "typeorm";

export class Init21685369050547 implements MigrationInterface {
    name = 'Init21685369050547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" ADD "operationResponse" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" DROP COLUMN "operationResponse"`);
    }

}
