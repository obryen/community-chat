import { MigrationInterface, QueryRunner } from "typeorm"

export class DatabaseSeed1682066463062 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

      // insert pre defined default users
        await queryRunner.query(`
        INSERT INTO 
        users (id, name)
        VALUES 
        (uuid_generate_v4(), 'Peter Petrelli');`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM  users`);
    }

}
