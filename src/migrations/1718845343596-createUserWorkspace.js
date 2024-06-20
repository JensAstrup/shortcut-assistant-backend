const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddGoogleId1718845343596 {
    name = 'AddGoogleId1718845343596'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "workspace" ("id" SERIAL NOT NULL, "shortcutId" character varying NOT NULL, "name" character varying NOT NULL, "vectorStorageId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_54f94498747e7120cca14a7c435" UNIQUE ("shortcutId"), CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "shortcutApiToken" character varying NOT NULL, "googleId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "workspaceId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_644a803e68bebd3eedff879ac96" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_644a803e68bebd3eedff879ac96"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "workspace"`);
    }
}
