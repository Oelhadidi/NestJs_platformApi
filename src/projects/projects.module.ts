import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { InterestsModule } from '../interests/interests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    InterestsModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService], // si utilisé ailleurs
})
export class ProjectsModule {}
