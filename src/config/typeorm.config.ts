import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {      // 📝AWS Elastic Beanstalk will provide RDS_ variables in production
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize     // 🤓 A technique for production is to set synchronize to true for the first deploy to avoid to manually create the schemas, and then redeploy with synchronize equal to false 
}