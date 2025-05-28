import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.decorator';

@Controller('investments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}
  
  @Get('project/:id')
  findByProject(@Param('id') id: string, @Request() req) {
    return this.investmentsService.findByProject(id, req.user);
  }

  @Role('investor')
  @Post()
  create(@Body() dto: CreateInvestmentDto, @Request() req) {
    const user = {
      id: req.user.userId,
      role: req.user.role
    };
    return this.investmentsService.create(dto, user);
  }

  @Role('investor')
  @Get()
  findAll(@Request() req) {
    const user = {
      id: req.user.userId,
      role: req.user.role
    };
    return this.investmentsService.findAll(user);
  }

  @Role('investor')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const user = {
      id: req.user.userId,
      role: req.user.role
    };
    return this.investmentsService.remove(id, user);
  }
} 