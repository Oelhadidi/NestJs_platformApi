import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private investmentRepo: Repository<Investment>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  async create(dto: CreateInvestmentDto, user: User): Promise<Investment> {
    if (user.role !== 'investor') {
      throw new ForbiddenException('Seuls les investisseurs peuvent investir');
    }

    const project = await this.projectRepo.findOne({
      where: { id: dto.projectId },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    const investment = new Investment();
    investment.amount = dto.amount;
    investment.investor = user;
    investment.project = project;

    return this.investmentRepo.save(investment);
  }

  async findAll(user: User): Promise<Investment[]> {
    if (user.role !== 'investor') {
      throw new ForbiddenException('Accès non autorisé');
    }

    return this.investmentRepo.find({
      where: { investor: { id: user.id } },
      relations: ['project', 'investor'],
    });
  }

  async findByProject(projectId: string, user: User): Promise<Investment[]> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }


    return this.investmentRepo.find({
      where: { project: { id: projectId } },
      relations: ['investor', 'project'],
    });
  }

  async remove(id: string, user: User): Promise<void> {
    const investment = await this.investmentRepo.findOne({
      where: { id },
      relations: ['investor'],
    });

    if (!investment) {
      throw new NotFoundException('Investissement non trouvé');
    }

    if (investment.investor.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Vous ne pouvez pas supprimer cet investissement');
    }

    await this.investmentRepo.remove(investment);
  }

  async findAllAdmin(): Promise<Investment[]> {
    return this.investmentRepo.find({
      relations: ['investor', 'project'],
    });
  }
} 