import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { dataSource } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { InterestsModule } from './interests/interests.module';
import { InvestmentsModule } from './investments/investments.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSource.options),
    AuthModule,
    UsersModule,
    ProjectsModule,
    InterestsModule,
    InvestmentsModule,
    AdminModule,
  ],
})
export class AppModule {}
