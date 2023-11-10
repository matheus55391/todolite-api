// tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UsersService } from 'src/users/users.service';
import { FindTaskDto } from './dto/find-task-dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const { title, description, userId } = createTaskDto;

    const user = await this.usersService.findByFilter({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const task = new Task(user, title, description, undefined, false);
    return await this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async findByFilter(filter: FindTaskDto): Promise<Task | undefined> {
    const { userId, ...taskFilterParams } = filter;
    const taskWhere = {
      id: taskFilterParams.taskId,
      title: taskFilterParams.title,
    };
    const userWhere = {
      id: userId,
    };
    return await this.taskRepository.findOne({
      where: {
        ...taskWhere,
        user: userWhere,
      },
    });
  }

  async remove(taskId: string, userId: string): Promise<void> {
    const user = await this.usersService.findByFilter({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const task = await this.findByFilter({ taskId: taskId, userId: userId });

    if (!task) {
      throw new NotFoundException(
        `Task with id ${taskId} not found for the user`,
      );
    }

    await this.taskRepository.remove(task);
  }
}
