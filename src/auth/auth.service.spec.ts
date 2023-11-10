import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const usersServiceMock = {
    create: jest.fn(),
    findByFilter: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createAuthDto: CreateAuthDto = {
        username: 'testuser',
        password: 'password123',
      };

      const createUserDto: CreateUserDto = {
        username: createAuthDto.username,
        password: createAuthDto.password,
      };

      const createdUser = new User(
        createUserDto.username,
        createUserDto.password,
        'abc123',
      );

      jest.spyOn(usersServiceMock, 'findByFilter').mockResolvedValueOnce(null);
      jest.spyOn(usersServiceMock, 'create').mockResolvedValueOnce(createdUser);

      const result = await service.register(createAuthDto);

      expect(result).toEqual(createdUser);
    });

    it('should throw UnauthorizedException if username already exists', async () => {
      const createAuthDto: CreateAuthDto = {
        username: 'existinguser',
        password: 'password123',
      };

      const existingUser: User = {
        id: '1',
        username: createAuthDto.username,
        password: createAuthDto.password,
        tasks: [],
      };

      jest
        .spyOn(usersService, 'findByFilter')
        .mockResolvedValueOnce(existingUser);

      try {
        await service.register(createAuthDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const loginAuthDto: LoginAuthDto = {
        username: 'testuser',
        password: 'password123',
      };

      const loginUser = new User(
        loginAuthDto.username,
        loginAuthDto.password,
        'abc123',
      );

      jest.spyOn(usersService, 'findByFilter').mockResolvedValueOnce(loginUser);

      const result = await service.login(loginAuthDto);

      expect(result).toEqual(loginUser);
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      const loginAuthDto: LoginAuthDto = {
        username: 'testuser',
        password: 'invalidpassword',
      };

      jest.spyOn(usersServiceMock, 'findByFilter').mockResolvedValueOnce(null);

      try {
        await service.login(loginAuthDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
