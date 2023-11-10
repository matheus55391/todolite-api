import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { UsersService } from 'src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { NotFoundException } from '@nestjs/common';
import { FindTaskDto } from './dto/find-task-dto';
import { User } from 'src/users/entities/user.entity';

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: Repository<Task>;
  let usersService: UsersService;

  const repositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const userServiceMock = {
    findByFilter: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: UsersService,
          useValue: userServiceMock,
        },
        {
          provide: getRepositoryToken(Task),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a task', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        password: 'testpassword',
      };
      const user = new User(mockUser.username, mockUser.password, mockUser.id);
      const mockCreateTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Description for test task',
        userId: '1',
      };

      jest.spyOn(usersService, 'findByFilter').mockResolvedValue(user);
      jest
        .spyOn(taskRepository, 'save')
        .mockImplementation(async (task) => task as Task);

      const result = await tasksService.create(mockCreateTaskDto);

      expect(result).toBeDefined();
      expect(result.title).toEqual(mockCreateTaskDto.title);
      expect(result.description).toEqual(mockCreateTaskDto.description);
      expect(result.user).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(usersService, 'findByFilter').mockResolvedValue(null);

      const mockCreateTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Description for test task',
        userId: '1',
      };
      try {
        await tasksService.create(mockCreateTaskDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const user = new User('testuser', 'testpassword', 'abc123');
      const mockTasks = [
        new Task(user, 'Task 1', 'Description for Task 1', 'abc123'),
        new Task(user, 'Task 2', 'Description for Task 2', 'abc124'),
      ];
      jest.spyOn(taskRepository, 'find').mockResolvedValue(mockTasks);

      const result = await tasksService.findAll();

      expect(result).toEqual(mockTasks);
    });
  });

  describe('findByFilter', () => {
    it('should find a task by filter', async () => {
      const mockFilter: FindTaskDto = {
        taskId: '1',
        title: 'Test Task',
        userId: '1',
      };

      jest.spyOn(taskRepository, 'findOne').mockResolvedValueOnce({} as Task);

      const result = await tasksService.findByFilter(mockFilter);

      expect(result).toBeDefined();
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockFilter.taskId,
          title: mockFilter.title,
          user: { id: mockFilter.userId },
        },
      });
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        password: 'testpassword',
      };
      const user = new User(mockUser.username, mockUser.password, mockUser.id);
      const mockTask = {
        id: '1',
        title: 'Test Task',
        description: 'Description for test task',
        user,
      };
      const task = new Task(
        user,
        mockTask.title,
        mockTask.description,
        mockTask.id,
      );

      jest.spyOn(usersService, 'findByFilter').mockResolvedValue(user);
      jest.spyOn(tasksService, 'findByFilter').mockResolvedValue(task);
      const removeMock = jest.fn().mockResolvedValue(undefined);
      jest.spyOn(taskRepository, 'remove').mockImplementation(removeMock);

      await tasksService.remove(mockTask.id, mockUser.id);

      expect(removeMock).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(usersService, 'findByFilter').mockResolvedValue(null);

      const mockTaskId = '1';
      const mockUserId = '1';

      try {
        await tasksService.remove(mockTaskId, mockUserId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw NotFoundException if task is not found for the user', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        password: 'testpassword',
      };
      const user = new User(mockUser.username, mockUser.password, mockUser.id);

      jest.spyOn(usersService, 'findByFilter').mockResolvedValue(user);
      jest.spyOn(tasksService, 'findByFilter').mockResolvedValue(null);

      const mockTaskId = '1';
      const mockUserId = '1';

      try {
        await tasksService.remove(mockTaskId, mockUserId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
