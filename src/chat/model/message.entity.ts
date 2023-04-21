import { TimeBaseEntity } from "../../common/time-base.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Room } from "./room.entity";

@Entity('room_messages')
export class RoomMessage extends TimeBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    text: string;

    @Column({ type: 'uuid', name: 'user_id', nullable: false })
    userId: string

    @Column({ type: 'uuid', name: 'room_id', nullable: false })
    roomId: string

    @ManyToOne(() => User, (u) => u.messages)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;
    @ManyToOne(() => Room, (r) => r.messages)
    @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
    room: Room;
}