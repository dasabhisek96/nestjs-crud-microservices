import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1712932924431 implements MigrationInterface {
    name = 'Init1712932924431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL, 
                "name" character varying NOT NULL, 
                "email" character varying NOT NULL, 
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "products" (
                "id" SERIAL NOT NULL, 
                "name" character varying NOT NULL, 
                "price" numeric NOT NULL, 
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
