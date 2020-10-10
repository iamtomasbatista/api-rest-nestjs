import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');     // 📝NestJS 'bootstrap;' is the context of the Logger instance created
  const app = await NestFactory.create(AppModule);

  const serverConfig = process.env.PORT || config.get('server');      // 📝Node.js process.env.<VAR> allow is to access Environment Variables
   
  const port = serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);  
}
bootstrap();
