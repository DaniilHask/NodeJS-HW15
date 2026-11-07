import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1794084958742 implements MigrationInterface {
    name = 'UpdateSchema1794084958742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "newsposts" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "newsposts" ADD "header" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "newsposts" ADD "deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE INDEX "IDX_48b1461e05ffe8d67858a4d486" ON "newsposts"  ("deleted") `);
        await queryRunner.query(`CREATE INDEX "IDX_99384b093935b597caf4e988ee" ON "newsposts"  ("authorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users"  ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_99384b093935b597caf4e988ee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48b1461e05ffe8d67858a4d486"`);
        await queryRunner.query(`ALTER TABLE "newsposts" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "newsposts" DROP COLUMN "header"`);
        await queryRunner.query(`ALTER TABLE "newsposts" ADD "title" character varying NOT NULL`);
    }

}
