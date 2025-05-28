import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { faker } from '@faker-js/faker';
import { User } from '../users/entities/user.entity';

export default class ProjectsSeeder extends Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const entrepreneurUsers = await dataSource
      .getRepository(User)
      .find({ where: { role: 'entrepreneur' } });

    if (entrepreneurUsers.length === 0) {
      console.warn('Aucun utilisateur entrepreneur trouvé. Aucun projet généré.');
      return;
    }

    const projects: Partial<Project>[] = [];

    for (let i = 0; i < 20; i++) {
      const randomEntrepreneur = faker.helpers.arrayElement(entrepreneurUsers);

      projects.push({
        title: faker.company.name(),
        description: faker.lorem.paragraph(),
        budget: faker.number.float({ min: 1000, max: 100000, fractionDigits: 2 }),
        category: faker.commerce.department(),
        owner: randomEntrepreneur,
      });
    }

    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Project)
      .values(projects)
      .execute();
  }
}
