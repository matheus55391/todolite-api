import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174001' })
  id?: string;
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({ example: 'testuser' })
  username?: string;
}
