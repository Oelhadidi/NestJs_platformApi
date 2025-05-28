// src/interests/interests.controller.ts
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserInterestsDto } from './dto/update-interest.dto';

@Controller()
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Get('interests')
  findAll() {
    return this.interestsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/me/interests')
  async getUserInterests(@Request() req) {
    if (!req.user) {
      throw new Error('User not found in request');
    }
    return await this.interestsService.getUserInterests(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('users/me/interests')
  async updateUserInterests(@Body() dto: UpdateUserInterestsDto, @Request() req) {
    if (!req.user) {
      throw new Error('User not found in request');
    }
    return await this.interestsService.updateUserInterests(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('projects/recommended')
  async getRecommended(@Request() req) {
    const user = req.user;

    if (!user || !user.id) {
      throw new Error('User not found in request');
    }

    return await this.interestsService.getRecommendedProjects(Number(user.id));
  }
}
