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

  async create(dto: CreateInvestmentDto, user: { id: string; role: string }): Promise<Investment> {
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

    // Créer l'investissement avec le QueryBuilder
    const result = await this.investmentRepo
      .createQueryBuilder()
      .insert()
      .into(Investment)
      .values({
        amount: dto.amount,
        investor: { id: user.id },
        project: { id: project.id }
      })
      .execute();

    // Récupérer l'investissement complet avec ses relations
    const completeInvestment = await this.investmentRepo.findOne({
      where: { id: result.identifiers[0].id },
      relations: ['investor', 'project'],
    });

    if (!completeInvestment) {
      throw new NotFoundException(
        "Erreur lors de la création de l'investissement",
      );
    }

    return completeInvestment;
  }

  async findAll(user: { id: string; role: string }): Promise<Investment[]> {
    if (user.role !== 'investor') {
      throw new ForbiddenException('Seuls les investisseurs peuvent consulter leurs investissements');
    }

    console.log('User ID:', user.id); // Debug log

    const investments = await this.investmentRepo
      .createQueryBuilder('investment')
      .innerJoinAndSelect('investment.investor', 'investor')
      .innerJoinAndSelect('investment.project', 'project')
      .where('investor.id = :userId', { userId: user.id })
      .orderBy('investment.date', 'DESC')
      .getMany();

    console.log('Found investments:', investments); // Debug log
    return investments;
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

  async remove(id: string, user: { id: string; role: string }): Promise<{ message: string }> {
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
    return { message: 'Investissement supprimé avec succès' };
  }

  async findAllAdmin(): Promise<Investment[]> {
    return this.investmentRepo.find({
      relations: ['investor', 'project'],
    });
  }
} 