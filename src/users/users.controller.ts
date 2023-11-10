import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get()
  @ApiOperation({ summary: 'Find one user by filter' })
  @ApiResponse({
    status: 200,
    description: 'Return the user based on the provided filter.',
  })
  @ApiQuery({ name: 'id', required: false, type: 'string' })
  @ApiQuery({ name: 'username', required: false, type: 'string' })
  async findOne(@Query() findUserDto: FindUserDto): Promise<User | undefined> {
    return this.usersService.findByFilter(findUserDto);
  }

  @Post()
  @ApiOperation({ deprecated: true, summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
