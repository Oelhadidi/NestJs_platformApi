import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('investment')
export class Investment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => User, user => user.investments)
  investor: User;

  @ManyToOne(() => Project, project => project.investments, { onDelete: 'CASCADE' })
  project: Project;
} 