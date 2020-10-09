import { User } from "src/auth/user.entity";
import { Entity, EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();

    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();

    delete task.user;      // 📝NestJS we are deleting the user property from the task that we're returning back to the controller to prevent this information been sent in the body of the response to the client 

    return task;      // 🤓 Is a good practice to return the resource created
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;                       // 📍ES6 Object Destructuring
    const query = this.createQueryBuilder('task');              // 📝NestJS createQueryBuilder is a method of Repository. 'task' is the keyword that references the entity into the query                

    query.andWhere('task.userId = :userId', { userId: user.id });

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