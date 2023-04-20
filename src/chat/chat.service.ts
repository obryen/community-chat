import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Room } from './model/room.entity';
import { Message } from './model/message.entity';
import { User } from './model/user.entity';


@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        private dataSource: DataSource
    ) { }

    async createRoom(name: string): Promise<Room> {
        const existingRoom = await this.roomRepository.findOne({ where: { name } });
        if (existingRoom) {
            throw new Error('Room already exists');
        }

        const room = new Room();
        room.name = name;

        return await this.roomRepository.save(room);
    }


    async addUserToRoom(roomId: string, userId: string): Promise<Room> {
        const room = await this.roomRepository.findOneOrFail({ where: { id: roomId } });
        const user = await this.userRepository.findOneOrFail({ where: { id: userId } });
        if (room.users.some(u => u.id === userId)) {
            throw new Error('User already in room');
        }
        room.users.push(user);
        return await this.roomRepository.save(room);
    }

    async sendMessageToRoom(roomId: string, userId: string, text: string): Promise<Message> {
        const room = await this.roomRepository.findOneOrFail({ where: { id: roomId } });
        const user = await this.userRepository.findOneOrFail({ where: { id: userId } });
        if (text.trim().length === 0) {
            throw new Error('Message text cannot be empty');
        }

        const message = new Message();
        message.text = text;
        message.room = room;
        message.user = user;
        return await this.messageRepository.save(message);
    }

    // added concurrency handling to the function using TypeORM's QueryRunner.
    async getLatestMessagesFromRoom(roomId: string, limit: number): Promise<Message[]> {
        const room = await this.roomRepository.findOneOrFail({ where: { id: roomId } });
        const connection = this.dataSource;
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const messages = await queryRunner.manager.find(Message, {
                where: { room: room },
                order: { createdAt: 'DESC' },
                take: limit,
                relations: ['user'],
            });
            await queryRunner.commitTransaction();
            return messages;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
