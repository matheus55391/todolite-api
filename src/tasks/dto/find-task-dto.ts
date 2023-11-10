import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FindTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsUUID()
  taskId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
