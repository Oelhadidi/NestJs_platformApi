import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User): Promise<Project> {
    try {
      const newProject = new Project();
      newProject.title = createProjectDto.title;
      newProject.description = createProjectDto.description;
      newProject.budget = Number(createProjectDto.budget);
      newProject.category = createProjectDto.category;
      newProject.owner = user;

      const savedProject = await this.projectRepository.save(newProject);
      
      // Fetch the project with relations after saving
      const project = await this.projectRepository.findOne({
        where: { id: savedProject.id },
        relations: ['owner']
      });

      if (!project) {
        throw new NotFoundException('Failed to create project');
      }

      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Projet introuvable');
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, user: User): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  
    if (!project) {
      throw new NotFoundException(`Projet avec l'id ${id} introuvable`);
    }
  
    // Vérifie si l'utilisateur est le propriétaire
    if (!project.owner || project.owner.id !== user.id) {
      console.log(project.owner.id, user);
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres projets');
      
    }
  
    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string, user: User): Promise<{ message: string}> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  
    if (!project) {
      throw new NotFoundException(`Projet avec l'id ${id} introuvable`);
    }
  
    // Seul le créateur du projet ou un admin peut supprimer
    if (project.owner?.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Suppression non autorisée');
    }
  
    await this.projectRepository.remove(project);
    return { message: `Le projet a été supprimé avec succès` };
  }
}
