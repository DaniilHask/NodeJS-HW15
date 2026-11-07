import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, Index } from 'typeorm';
import { User } from './User.js';

@Entity('newsposts')
export class Newspost {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar' })
  header!: string;

  @Column({ type: 'boolean', default: false })
  @Index()
  deleted!: boolean;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'varchar', default: 'Other' })
  genre!: 'Politic' | 'Business' | 'Sport' | 'Other';

  @Column({ type: 'boolean', default: false })
  isPrivate!: boolean;

  @CreateDateColumn()
  createDate!: Date;

  @ManyToOne(() => User, (user) => user.newsposts, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'authorId' })
  author!: User;

  @Column({ type: 'int' })
  @Index()
  authorId!: number;
}