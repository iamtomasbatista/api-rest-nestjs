import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './dto/pipes/task.status.validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}    
  
  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto) {    
    return this.tasksService.getTasks(filterDto);     // 📝NestJS Will transform this into an HTTP response and it will send it to the client
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()  
  @UsePipes(ValidationPipe)                                             // 📝NestJS will validate the incoming request against the class validator definitions (rules) added to the DTO  
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {     // If ValidationPipe validations fails, it will return 400 Bad Request Error with details on what went wrong base on the rules     
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number, 
    @Body('status', TaskStatusValidationPipe) status: TaskStatus      // 📝NestJS will create a new instance behind the scenes -> @Body('status', new TaskStatusValidationPipe(...)) status: TaskStatus. You could pass an instance of the class instead
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status);
  }
  
}

