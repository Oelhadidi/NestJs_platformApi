import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { Interest } from '../interests/entities/interest.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    @InjectRepository(Interest)
    private interestRepository: Repository<Interest>
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

  async addInterests(userId: string, interestIds: string[]): Promise<User> {
    const user = await this.findOne(userId);
    const interests = await this.interestRepository.findByIds(interestIds);
    
    if (!interests.length) {
      throw new NotFoundException('Aucun intérêt trouvé');
    }

    user.interests = [...(user.interests || []), ...interests];
    return this.usersRepository.save(user);
  }

  async removeInterests(userId: string, interestIds: string[]): Promise<User> {
    const user = await this.findOne(userId);
    
    if (!user.interests) {
      return user;
    }

    user.interests = user.interests.filter(
      interest => !interestIds.includes(interest.id.toString())
    );
    
    return this.usersRepository.save(user);
  }

  async getUserInterests(userId: string): Promise<Interest[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests']
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user.interests || [];
  }
}
