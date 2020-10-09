import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTasksFilterDto {
  @IsOptional() 
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])     // ❓TS How to cast an enum into any[]  
  status: TaskStatus;   

  @IsOptional() 
  @IsNotEmpty()
  search: string;
}