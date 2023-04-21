import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { TimeBaseEntity } from "../../common/time-base.entity";
import { RoomMessage } from "./message.entity";


@Entity('rooms')
export class Room extends TimeBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @ManyToMany(() => User, (u) => u.rooms, { cascade: true, eager: true })
    @JoinTable({
        name: 'room_users',
        joinColumn: { name: 'room_id', referencedColumnName: 'id' },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    })
    users: User[];

    @OneToMany(() => RoomMessage, (m) => m.room, { eager: true })
    messages: RoomMessage[];
}