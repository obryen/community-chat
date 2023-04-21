import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Room } from './model/room.entity';
import { RoomMessage } from './model/message.entity';
import { User } from './model/user.entity';


@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(RoomMessage)
        private messageRepository: Repository<RoomMessage>,
        private dataSource: DataSource
    ) { }

    async fetchUser(): Promise<User> {
        const users = await this.userRepository.find();
        return users[0];
    }

    async createRoom(name: string): Promise<Room> {
        const existingRoom = await this.roomRepository.findOne({ where: { name } });
        if (existingRoom) {
            throw new ConflictException('Room already exists');
        }

        const room = new Room();
        room.name = name;

        return await this.roomRepository.save(room);
    }


    async addUserToRoom(roomId: string, userId: string): Promise<Room> {
        const room = await this.roomRepository.findOneOrFail({ where: { id: roomId } });
        const user = await this.userRepository.findOneOrFail({ where: { id: userId } });
        if (room.users.some(u => u.id === userId)) {
            throw new ConflictException('User already in room');
        }
        room.users.push(user);
        return await this.roomRepository.save(room);
    }

    async sendMessageToRoom(roomId: string, userId: string, text: string): Promise<RoomMessage> {
        const room = await this.roomRepository.findOne({ where: { id: roomId } });
        if (!room) {
            throw new NotFoundException('Room does not exist')
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User does not exist')
        }
        if (text.trim().length === 0) {
            throw new BadRequestException('Message text cannot be empty');
        }

        const message = new RoomMessage();
        message.text = text;
        message.room = room;
        message.user = user;
        return await this.messageRepository.save(message);
    }

    async getLatestMessagesFromRoom(roomId: string, limit: number): Promise<RoomMessage[]> {
        const connection = this.dataSource;
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const messages = await queryRunner.manager.find(RoomMessage, {
                where: { roomId: roomId },
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
