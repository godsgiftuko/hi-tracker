import { MigrationInterface, QueryRunner } from "typeorm";

export class addOtpToUser1678557509447 implements MigrationInterface {
    name = 'addOtpToUser1678557509447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "otp" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otp"`);
    }

}
