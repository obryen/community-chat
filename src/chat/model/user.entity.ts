import { TimeBaseEntity } from "../../common/time-base.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";
import { RoomMessage } from "./message.entity";


@Entity('users')
export class User extends TimeBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @ManyToMany(() => Room, (r) => r.users)
    rooms: Room[];

    @OneToMany(() => RoomMessage, (m) => m.user)
    messages: RoomMessage[];
}