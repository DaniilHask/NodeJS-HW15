import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Newspost } from './Newspost.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @OneToMany(() => Newspost, (newspost) => newspost.author)
  newsposts!: Newspost[];
}