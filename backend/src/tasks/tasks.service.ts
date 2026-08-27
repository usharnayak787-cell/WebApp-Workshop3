import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { EmailService } from '../email.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly emailService: EmailService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create(createTaskDto);
    const savedTask = await this.taskRepository.save(task);

    await this.emailService.sendTaskCreatedEmail(
      savedTask.title,
      savedTask.priority,
    );

    return savedTask;
  }

  findAll() {
    return this.taskRepository.find();
  }

  async findOne(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    await this.taskRepository.update(id, updateTaskDto);
    return this.taskRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.taskRepository.delete(id);
    return { message: 'Task deleted successfully' };
  }
}