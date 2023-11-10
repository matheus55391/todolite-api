import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(createAuthDto: CreateAuthDto): Promise<User> {
    const createUserDto: CreateUserDto = {
      username: createAuthDto.username,
      password: createAuthDto.password,
    };
    return this.usersService.create(createUserDto);
  }

  async login(loginAuthDto: LoginAuthDto): Promise<User> {
    const user = await this.usersService.findByFilter({
      username: loginAuthDto.username,
    });

    if (!user || loginAuthDto.password !== user.password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }
}
