// src/interests/interests.service.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Interest } from './entities/interest.entity';
import { Repository, In } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdateUserInterestsDto } from './dto/update-interest.dto';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class InterestsService {
  private readonly logger = new Logger(InterestsService.name);

  constructor(
    @InjectRepository(Interest)
    private interestRepo: Repository<Interest>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  async findAll() {
    return this.interestRepo.find();
  }

  async updateUserInterests(userId: string, dto: UpdateUserInterestsDto) {
    
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const interests = await this.interestRepo.findBy({ id: In(dto.interestIds) });

    user.interests = interests;
    const savedUser = await this.userRepo.save(user);

    return savedUser;
  }

  async getUserInterests(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    return user.interests;
  }

  async getRecommendedProjects(userId: number | string) {
    this.logger.log(`[getRecommendedProjects] Starting with userId: ${userId}`);
    
    const user = await this.userRepo.findOne({
      where: { id: String(userId) },
      relations: ['interests'],
    });
  
    this.logger.log(`[getRecommendedProjects] Found user: ${JSON.stringify(user)}`);
  
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
  
    const interestNames = user.interests.map(i => i.name.trim().toLowerCase());
    this.logger.log(`[getRecommendedProjects] User interests: ${JSON.stringify(interestNames)}`);
  
    const debugInfo = {
      userId,
      userInterests: interestNames,
      hasInterests: interestNames.length > 0,
    };
  
    if (interestNames.length === 0) {
      this.logger.log('[getRecommendedProjects] No interests found for user');
      return {
        projects: [],
        debug: {
          ...debugInfo,
          message: 'No interests found for user'
        }
      };
    }
  
    const allProjects = await this.projectRepo.find();
    this.logger.log(`[getRecommendedProjects] All projects: ${JSON.stringify(allProjects.map(p => ({ id: p.id, title: p.title, category: p.category })))}`);
    
    const matchedProjects = allProjects.filter(p =>
      interestNames.includes(p.category?.trim().toLowerCase())
    );
    
    this.logger.log(`[getRecommendedProjects] Matched projects: ${JSON.stringify(matchedProjects.map(p => ({ id: p.id, title: p.title, category: p.category })))}`);
  
    return {
      projects: matchedProjects,
      debug: {
        ...debugInfo,
        matchedCount: matchedProjects.length,
        message: matchedProjects.length > 0
          ? 'Projects matched user interests'
          : 'No projects match user interests',
      }
    };
  }
}
