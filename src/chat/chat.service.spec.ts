import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Room } from './model/room.entity';
import { User } from './model/user.entity';
import { RoomMessage } from './model/message.entity';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('ChatService', () => {
  let service: ChatService;
  let roomRepository: Repository<Room>;
  let userRepository: Repository<User>;
  let messageRepository: Repository<RoomMessage>;
  let dataSource: DataSource;

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
    dataSource = module.get<DataSource>(getDataSourceToken());
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

  describe('addUserToRoom', () => {
    const roomId = '1';
    const userId = '2';

    it('should add a user to a room', async () => {
      const fakeRoomRecord = { id: roomId, name: 'test room', users: [] } as Room;
      const user = { id: userId, name: 'Mary' } as User;
      jest.spyOn(roomRepository, 'findOne').mockResolvedValueOnce(Promise.resolve(fakeRoomRecord));
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(Promise.resolve(user));
      jest.spyOn(roomRepository, 'save').mockResolvedValueOnce({} as Room);
      const fakeRoomWithNewUser = JSON.parse(JSON.stringify(fakeRoomRecord));
      await service.addUserToRoom(roomId, userId);


      expect(roomRepository.findOne).toHaveBeenCalledWith({ where: { id: roomId } });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });

      console.log('input payload', fakeRoomWithNewUser);
      expect(roomRepository.save).toHaveBeenCalledWith({ ...fakeRoomWithNewUser, users: [user] });
    });

    it('should throw an error if the room does not exist', async () => {
      jest.spyOn(roomRepository, 'findOne').mockReturnValueOnce(null);
      jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(null);
      jest.spyOn(roomRepository, 'save').mockResolvedValueOnce({} as Room);

      await expect(service.addUserToRoom(roomId, userId)).rejects.toThrowError();
      expect(roomRepository.findOne).toHaveBeenCalledWith({ where: { id: roomId } });
      expect(userRepository.findOne).not.toHaveBeenCalled();
      expect(roomRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an error if the user does not exist', async () => {
      const room = { id: roomId, name: 'test room', users: [{ id: '1', name: 'John' }] } as Room;
      jest.spyOn(roomRepository, 'findOne').mockResolvedValueOnce(Promise.resolve({ ...room }));
      jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(null);
      jest.spyOn(roomRepository, 'save').mockResolvedValueOnce({} as Room);

      await expect(service.addUserToRoom(roomId, userId)).rejects.toThrow(NotFoundException);
      expect(roomRepository.findOne).toHaveBeenCalledWith({ where: { id: roomId } });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(roomRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an error if the user is already in the room', async () => {
      const room = { id: roomId, name: 'test room', users: [{ id: userId, name: 'Mary' }] } as Room;
      jest.spyOn(roomRepository, 'findOne').mockResolvedValueOnce(room);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(room.users[0] as User);
      jest.spyOn(roomRepository, 'save').mockResolvedValueOnce({} as Room);

      await expect(service.addUserToRoom(roomId, userId)).rejects.toThrow(ConflictException);
      expect(roomRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('sendMessageToRoom', () => {
    it('should send a message to a room', async () => {
      // Arrange
      const roomId = 'abc123';
      const userId = 'xyz789';
      const text = 'Hello, World!';
      const room = new Room();
      const user = new User();
      const message = new RoomMessage();
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(room);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(messageRepository, 'save').mockResolvedValue(message);

      // Act
      const result = await service.sendMessageToRoom(roomId, userId, text);

      // Assert
      expect(result).toEqual(message);
      expect(roomRepository.findOne).toHaveBeenCalledWith({ where: { id: roomId } });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(messageRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        text,
        room,
        user,
      }));
    });

    it('should throw a NotFoundException if the room does not exist', async () => {
      // Arrange
      const roomId = 'abc123';
      const userId = 'xyz789';
      const text = 'Hello, World!';
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(undefined);

      // Act and Assert
      await expect(service.sendMessageToRoom(roomId, userId, text)).rejects.toThrowError(NotFoundException);
    });

    it('should throw a NotFoundException if the user does not exist', async () => {
      // Arrange
      const roomId = 'abc123';
      const userId = 'xyz789';
      const text = 'Hello, World!';
      const room = new Room();
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(room);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      // Act and Assert
      await expect(service.sendMessageToRoom(roomId, userId, text)).rejects.toThrowError(NotFoundException);
    });

    it('should throw a BadRequestException if the message text is empty', async () => {
      // Arrange
      const roomId = 'abc123';
      const userId = 'xyz789';
      const text = '';
      const room = new Room();
      const user = new User();
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(room);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      // Act and Assert
      await expect(service.sendMessageToRoom(roomId, userId, text)).rejects.toThrowError(BadRequestException);
    });
  });
});
