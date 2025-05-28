import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Profil utilisateur connecté
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  // ✅ Gestion des intérêts
  @UseGuards(JwtAuthGuard)
  @Get('interests')
  getUserInterests(@Request() req) {
    return this.usersService.getUserInterests(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('investor')
  @Post('interests')
  addInterests(@Request() req, @Body() interests: { interestIds: string[] }) {
    return this.usersService.addInterests(req.user.userId, interests.interestIds);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('investor')
  @Delete('interests')
  removeInterests(@Request() req, @Body() interests: { interestIds: string[] }) {
    return this.usersService.removeInterests(req.user.userId, interests.interestIds);
  }

  // ✅ Mise à jour du profil
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(@Request() req, @Body() updateData: Partial<User>) {
    return this.usersService.update(req.user.userId, updateData);
  }

  // 🔒 Admin uniquement ou à supprimer
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @Get('email/:email')
  getUserByEmail(@Param('email') email: string): Promise<User | null> {
    return this.usersService.findByEmail(email);
  }

  // ❌ À désactiver ou restreindre (création publique via /auth/register normalement)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // ✅ Admin uniquement
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // ❌ À désactiver ou à sécuriser (accès à un user par ID)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ❌ À désactiver ou sécuriser si besoin (édition par ID)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // ✅ Admin : suppression
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
