import { TimeBaseEntity } from "../../common/time-base.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Room } from "./room.entity";

@Entity('messages')
export class Message extends TimeBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    text: string;

    @ManyToOne(() => User, (u) => u.messages)
    user: User;
    @ManyToOne(() => Room, (r) => r.messages)
    room: Room;
}