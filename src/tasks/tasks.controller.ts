import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTaskDto } from './dto/find-task-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks.' })
  async findAll() {
    return await this.tasksService.findAll();
  }

  @Get()
  @ApiOperation({ summary: 'Find one task by filter' })
  @ApiResponse({
    status: 200,
    description: 'Return the task based on the provided filter.',
  })
  async findOne(@Query() findTaskDto: FindTaskDto) {
    const foundTask = await this.tasksService.findByFilter(findTaskDto);
    return foundTask;
  }

  @Delete(':id/:userId')
  @ApiOperation({ summary: 'Remove a task by ID and user ID' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully removed.',
  })
  async remove(@Param('id') id: string, @Param('userId') userId: string) {
    await this.tasksService.remove(id, userId);
    return { message: 'Task removed successfully' };
  }
}
