import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "src/tasks/task-status.enum";


export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [      // 📝TS readonly means that even during runtime it can not be modified by the class members                                                  
    TaskStatus.IN_PROGRESS,       
    TaskStatus.OPEN,
    TaskStatus.DONE
  ];

  transform(value: any) {
    value = value.toUpperCase();
                                                                              
    if (!this.isStatusValid(value)) {     // ❓TS Another approach to be tested: if (value in TaskStatus)
      throw new BadRequestException();
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}