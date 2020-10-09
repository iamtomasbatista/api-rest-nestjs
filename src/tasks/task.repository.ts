import { Entity, EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();

    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();

    return task;      // 🤓 Is a good practice to return the resource created
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;                       // 📍ES6 Object Destructuring
    const query = this.createQueryBuilder('task');              // 📝NestJS createQueryBuilder is a method of Repository. 'task' is the keyword that references the entity into the query                

    if (status) {                                               // 📝NestJS :status is a variable that is gonna be populated by the obj argument: { status }, that is { status: <CLIENT INPUT> }                   
      query.andWhere('task.status = :status', { status });      // 📍ES6 Property Value Shorthand. Syntactic sugar for title: title 
    }                                                           // 📝NestJS we use andWhere coz we want our queries work together! Not override each other!                                                                                   

    if (search) {      
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });      // 📝NestJS `%${search}%` nomenclature to work with partial matching
    }

    const tasks = await query.getMany();
    return tasks;
  }

}