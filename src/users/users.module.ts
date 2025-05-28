import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { Interest } from '../interests/entities/interest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Interest])],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository], //pour pouvoir l'utiliser dans AuthModule
})
export class UsersModule {}
