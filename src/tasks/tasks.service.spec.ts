import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = { id: '20', username: 'TestUser' };
const mockFilters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query' };
const mockTasks = ['task1', 'task2', 'task3'];
const mockTask = { title: 'Test Task', description: "Test Description" };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn()
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository }
      ]
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('calls getTasks from the repository', () => {      
      expect(taskRepository.getTasks).not.toHaveBeenCalled();            
      tasksService.getTasks(mockFilters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
    });

    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue(mockTasks);
      const tasks = await tasksService.getTasks(mockFilters, mockUser);
      expect(tasks).toEqual(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('calls findOne from the repository with the correct argument and succesfully retrieve and return the task', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);
      const task = await tasksService.getTaskById(1, mockUser);
      expect(task).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: mockUser.id }});
    });

    it('throws an error as task is not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      await expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
    });    
  });

  describe('createTask', () => {
    it('calls create from the repository and returns the task created', async () => {
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      taskRepository.createTask.mockResolvedValue(mockTask);
      const task = await tasksService.createTask(mockTask, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(mockTask, mockUser);      
      expect(task).toEqual(mockTask);
    });
  }); 

  describe('deleteTask', () => {
    it('calls deleteTask from repository to delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id }); 
    });

    it('throws an error as task could not be found', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTaskStatus', () => {
    it('updates task status', async () => {
      const save = jest.fn().mockResolvedValue(true);
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save
      });

      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE); 
    });
  });

});