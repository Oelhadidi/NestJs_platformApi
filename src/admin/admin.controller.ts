import { Controller, Get, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.decorator';
import { UsersService } from '../users/users.service';
import { InvestmentsService } from '../investments/investments.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role('admin')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly investmentsService: InvestmentsService,
  ) {}

  @Get('users')
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('investments')
  async getAllInvestments() {
    return this.investmentsService.findAllAdmin();
  }
} 