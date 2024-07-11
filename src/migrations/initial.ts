import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial implements MigrationInterface {
    name = 'Initial'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth_users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "shortcutApiToken" character varying NOT NULL, "googleAuthToken" character varying NOT NULL, "googleId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "workspaceId" integer, CONSTRAINT "UQ_13d8b49e55a8b06bee6bbc828fb" UNIQUE ("email"), CONSTRAINT "PK_c88cc8077366b470dafc2917366" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workspace" ("id" SERIAL NOT NULL, "shortcutId" character varying NOT NULL, "name" character varying NOT NULL, "vectorStorageId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_54f94498747e7120cca14a7c435" UNIQUE ("shortcutId"), CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "auth_users" ADD CONSTRAINT "FK_316e2de87f08e3175853f86d5fb" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_users" DROP CONSTRAINT "FK_316e2de87f08e3175853f86d5fb"`);
        await queryRunner.query(`DROP TABLE "workspace"`);
        await queryRunner.query(`DROP TABLE "auth_users"`);
    }

}
