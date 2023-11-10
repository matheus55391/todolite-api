// task.entity.ts
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  user: User;

  constructor(
    user: User,
    title: string,
    description: string,
    taskId?: string,
    completed?: boolean,
  ) {
    this.id = taskId || uuid();
    this.title = title;
    this.description = description;
    this.completed = completed || false;
    this.createdAt = new Date();
    this.user = user;
  }
}
