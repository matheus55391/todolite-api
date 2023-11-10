import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FindManyTaskDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Task Title' })
  title?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174002' })
  userId?: string;
}
