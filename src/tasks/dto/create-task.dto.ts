// create-task.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Task Title' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Task Description' })
  description: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  userId: string;
}
