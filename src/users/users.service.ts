import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository
  ) {}


  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }
  

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }
  
  async update(id: string, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }
  
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.usersRepository.delete(id);
  
    if (result.affected === 0) {
      throw new NotFoundException(`Utilisateur avec l'id ${id} non trouvé`);
    }
  
    return { message: `Utilisateur a été supprimé avec succès` };
  }
}
