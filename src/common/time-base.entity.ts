import { CreateDateColumn, UpdateDateColumn } from "typeorm";


export class TimeBaseEntity {

    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;


    @CreateDateColumn({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}