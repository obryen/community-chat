import { TimeBaseEntity } from "src/common/time-base.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";
import { Message } from "./message.entity";


@Entity('user')
export class User extends TimeBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @ManyToMany(() => Room, (r) => r.users, { cascade: true })
    rooms: Room[];

    @OneToMany(() => Message, (m) => m.user)
    messages: Message[];
}