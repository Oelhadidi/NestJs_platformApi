import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { Interest } from '../interests/entities/interest.entity';

export default class InterestsSeeder extends Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const interests: Partial<Interest>[] = [
      { name: 'Technology' },
      { name: 'Healthcare' },
      { name: 'Education' },
      { name: 'Finance' },
      { name: 'Real Estate' },
      { name: 'Entertainment' },
      { name: 'Sports' },
      { name: 'Food & Beverage' },
      { name: 'Fashion' },
      { name: 'Automotive' },
      { name: 'Energy' },
      { name: 'Agriculture' },
      { name: 'Manufacturing' },
      { name: 'Retail' },
      { name: 'Transportation' },
      { name: 'Media' },
      { name: 'Construction' },
      { name: 'Telecommunications' },
      { name: 'Tourism' },
      { name: 'Environmental' }
    ];

    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Interest)
      .values(interests)
      .execute();
  }
} 