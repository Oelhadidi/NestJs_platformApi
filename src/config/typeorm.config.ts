import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { Interest } from '../interests/entities/interest.entity';
import { Investment } from '../investments/entities/investment.entity';
import { DataSource } from 'typeorm';
require('dotenv').config();

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Project, Interest, Investment],
  migrations: ['src/migrations/*.ts'],
  synchronize: true,
});

export default dataSource;
