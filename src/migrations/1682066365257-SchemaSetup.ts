import { MigrationInterface, QueryRunner } from "typeorm";

export class  SchemaSetup1682066365257 implements MigrationInterface {
    name = ' SchemaSetup1682066365257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "room_messages" ("updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "user_id" uuid NOT NULL, "room_id" uuid NOT NULL, CONSTRAINT "PK_bd83c95b3d0ad3931d6c1687ee1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rooms" ("updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_users" ("room_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_ba0fd8c93a7d079c1ebe5db4e16" PRIMARY KEY ("room_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_443c187b06edbc18738b24aac3" ON "room_users" ("room_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5421c55fb0212b9ff62fe9d3c8" ON "room_users" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "room_messages" ADD CONSTRAINT "FK_fbbe612826b63f7bbe7814db69e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_messages" ADD CONSTRAINT "FK_5d7030d4020b3f568d3a4791260" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_users" ADD CONSTRAINT "FK_443c187b06edbc18738b24aac34" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "room_users" ADD CONSTRAINT "FK_5421c55fb0212b9ff62fe9d3c89" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_users" DROP CONSTRAINT "FK_5421c55fb0212b9ff62fe9d3c89"`);
        await queryRunner.query(`ALTER TABLE "room_users" DROP CONSTRAINT "FK_443c187b06edbc18738b24aac34"`);
        await queryRunner.query(`ALTER TABLE "room_messages" DROP CONSTRAINT "FK_5d7030d4020b3f568d3a4791260"`);
        await queryRunner.query(`ALTER TABLE "room_messages" DROP CONSTRAINT "FK_fbbe612826b63f7bbe7814db69e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5421c55fb0212b9ff62fe9d3c8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_443c187b06edbc18738b24aac3"`);
        await queryRunner.query(`DROP TABLE "room_users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
        await queryRunner.query(`DROP TABLE "room_messages"`);
    }

}
