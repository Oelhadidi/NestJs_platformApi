import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Request,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.decorator';
import { InterestsService } from 'src/interests/interests.service';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly interestsService: InterestsService,
  ) {}

  @Role('entrepreneur')
  @Post()
  create(@Body() dto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(dto, req.user);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('recommended')
  async getRecommended(@Request() req) {
    if (!req.user) {
      throw new Error('User not found in request');
    }
    this.logger.log(`User from request: ${JSON.stringify(req.user)}`);
    return await this.interestsService.getRecommendedProjects(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Role('entrepreneur')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @Request() req) {
    return this.projectsService.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(id, req.user);
  }
}
