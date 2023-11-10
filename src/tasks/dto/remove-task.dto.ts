// remove-task.dto.ts

import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveTaskDto {
  @ApiProperty({ description: 'ID of the task', example: '1' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'ID of the user', example: '123' })
  @IsString()
  userId: string;
}
