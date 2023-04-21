import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Room } from './model/room.entity';
import { User } from './model/user.entity';
import { RoomMessage } from './model/message.entity';
import { ConflictException } from '@nestjs/common';

describe('ChatService', () => {
    let service: ChatService;
    let roomRepository: Repository<Room>;
    let userRepository: Repository<User>;
    let messageRepository: Repository<RoomMessage>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChatService,
                {
                    provide: getRepositoryToken(Room),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(RoomMessage),
                    useClass: Repository,
                },
                {
                    provide: DataSource,
                    useValue: DataSource,
                },
            ],
        }).compile();

        service = module.get<ChatService>(ChatService);
        roomRepository = module.get<Repository<Room>>(getRepositoryToken(Room));
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        messageRepository = module.get<Repository<RoomMessage>>(getRepositoryToken(RoomMessage));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });


    describe('createRoom', () => {
        const name = 'test room';

        it('should create a new room', async () => {
            jest.spyOn(roomRepository, 'findOne').mockResolvedValueOnce(undefined);
            const saveSpy = jest.spyOn(roomRepository, 'save').mockImplementationOnce(room => Promise.resolve({ name } as Room));

            const result = await service.createRoom(name);

            expect(result.name).toEqual(name);
            expect(saveSpy).toHaveBeenCalled();
        });

        it('should throw an error if the room already exists', async () => {
            const existingRoom = new Room();
            existingRoom.name = name;
            jest.spyOn(roomRepository, 'findOne').mockResolvedValueOnce(existingRoom);

            await expect(service.createRoom(name)).rejects.toThrowError();
        });
    });

});
