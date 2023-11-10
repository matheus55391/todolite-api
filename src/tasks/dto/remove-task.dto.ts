// remove-task.dto.ts

import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveTaskDto {
  @IsString()
  @ApiProperty({ description: 'ID of the task', example: '1' })
  id: string;

  @IsString()
  @ApiProperty({ description: 'ID of the user', example: '123' })
  userId: string;
}
