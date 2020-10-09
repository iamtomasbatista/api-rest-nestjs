import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { isMimeType } from 'class-validator';
import { typeOrmConfig } from './config/typeorm.config';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TasksModule
  ]
})
export class AppModule {}
