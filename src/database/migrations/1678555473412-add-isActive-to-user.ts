import { MigrationInterface, QueryRunner } from "typeorm";

export class addIsActiveToUser1678555473412 implements MigrationInterface {
    name = 'addIsActiveToUser1678555473412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
    }

}
