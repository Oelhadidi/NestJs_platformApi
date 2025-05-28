import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { Investment } from '../investments/entities/investment.entity';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { faker } from '@faker-js/faker';

export default class InvestmentsSeeder extends Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    // Get all investors
    const investors = await dataSource
      .getRepository(User)
      .find({ where: { role: 'investor' } });

    if (investors.length === 0) {
      console.warn('Aucun investisseur trouvé. Aucun investissement généré.');
      return;
    }

    // Get all projects
    const projects = await dataSource
      .getRepository(Project)
      .find();

    if (projects.length === 0) {
      console.warn('Aucun projet trouvé. Aucun investissement généré.');
      return;
    }

    const investments: Partial<Investment>[] = [];

    // Generate 30 random investments
    for (let i = 0; i < 30; i++) {
      const randomInvestor = faker.helpers.arrayElement(investors);
      const randomProject = faker.helpers.arrayElement(projects);

      // Generate a random amount between 100 and 10000
      const amount = faker.number.float({ 
        min: 100, 
        max: 10000, 
        fractionDigits: 2 
      });

      investments.push({
        amount,
        investor: randomInvestor,
        project: randomProject,
        date: faker.date.recent({ days: 30 }), // Random date within last 30 days
      });
    }

    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Investment)
      .values(investments)
      .execute();
  }
} 