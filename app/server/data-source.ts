import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User.js';
import { Newspost } from './entities/Newspost.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5433,
  username: 'postgres',
  password: 'secretpassword',
  database: 'mydb',
  synchronize: true,
  logging: false,
  entities: [User, Newspost],
  subscribers: [],
  migrations: [],
});