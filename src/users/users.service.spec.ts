// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const repositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const fakeUser = {
        username: 'testuser',
        password: 'password123',
      };

      const user = new User(fakeUser.username, fakeUser.password);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const result = await service.create(fakeUser);

      expect(result).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const fakeUsers = [
        new User('user1', 'pass1'),
        new User('user2', 'pass2'),
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(fakeUsers);

      const result = await service.findAll();

      expect(result).toEqual(fakeUsers);
    });
  });

  describe('findByFilter', () => {
    it('should return a user by username', async () => {
      const fakeUser = {
        username: 'testuser',
        password: 'password123',
      };

      const user = new User(fakeUser.username, fakeUser.password);
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findByFilter({
        username: fakeUser.username,
      });

      expect(result).toEqual(user);
    });

    it('should return a user by id', async () => {
      const fakeUser = {
        id: 'abc123',
        username: 'testuser',
        password: 'password123',
      };

      const user = new User(fakeUser.username, fakeUser.password, fakeUser.id);
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findByFilter({
        id: fakeUser.id,
      });

      expect(result).toEqual(user);
    });

    it('should return undefined if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      const result = await service.findByFilter({
        username: 'nonexistentuser',
      });

      expect(result).toBeUndefined();
    });
  });
});
