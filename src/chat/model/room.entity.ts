import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { TimeBaseEntity } from "src/common/time-base.entity";
import { Message } from "./message.entity";


@Entity('room')
export class Room extends TimeBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @ManyToMany(() => User, (u) => u.rooms, { cascade: true })
    @JoinTable({
        name: 'room_users',
        joinColumn: { name: 'room_id', referencedColumnName: 'id' },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    })
    users: User[];

    @OneToMany(() => Message, (m) => m.room, { eager: true })
    messages: Message[];
}