import { Controller, Post, Get, Body, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTaskDto } from './dto/find-task-dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RemoveTaskDto } from './dto/remove-task.dto';
import { FindManyTaskDto } from './dto/find-many-task-dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
  })
  @ApiBody({ type: CreateTaskDto })
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.create(createTaskDto);
  }

  @Get('all')
  @ApiOperation({ deprecated: true, summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks.' })
  async findAll() {
    return await this.tasksService.findAll();
  }

  @Get()
  @ApiOperation({ summary: 'Get tasks by filter' })
  @ApiResponse({
    status: 200,
    description: 'Return tasks based on the filter.',
  })
  async findManyByFilter(@Query() filter: FindManyTaskDto) {
    return await this.tasksService.findManyByFilter(filter);
  }

  @Get('find')
  @ApiOperation({ summary: 'Find one task by filter' })
  @ApiResponse({
    status: 200,
    description: 'Return the task based on the provided filter.',
  })
  async findOne(@Query() findTaskDto: FindTaskDto) {
    const foundTask = await this.tasksService.findByFilter(findTaskDto);
    return foundTask;
  }

  @Delete()
  @ApiOperation({ summary: 'Remove a task by ID and user ID' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully removed.',
  })
  @ApiBody({ type: RemoveTaskDto })
  async remove(@Body() removeTaskDto: RemoveTaskDto) {
    const { id, userId } = removeTaskDto;
    await this.tasksService.remove(id, userId);
    return { message: 'Task removed successfully' };
  }
}
