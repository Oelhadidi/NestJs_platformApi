import { Project } from '../../projects/entities/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Interest } from '../../interests/entities/interest.entity';
import { Investment } from '../../investments/entities/investment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  lastname: string;

  @Column()
  firstname: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'entrepreneur', 'investor'] })
  role: 'admin' | 'entrepreneur' | 'investor';

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Project, project => project.owner)
  projects: Project[];

  @OneToMany(() => Investment, investment => investment.investor)
  investments: Investment[];

  @ManyToMany(() => Interest, interest => interest.users, { cascade: true })
  @JoinTable()
  interests: Interest[];
}
