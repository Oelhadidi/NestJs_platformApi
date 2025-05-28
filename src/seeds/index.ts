import dataSource from '../config/typeorm.config';
import UsersSeeder from './users.seeder';
import ProjectsSeeder from './projects.seeder';
import InterestsSeeder from './interests.seeder';
import InvestmentsSeeder from './investments.seeder';

async function runSeeders() {
  await dataSource.initialize();

  const userSeeder = new UsersSeeder();
  await userSeeder.run(dataSource);

  const projectSeeder = new ProjectsSeeder();
  await projectSeeder.run(dataSource);

  const interestSeeder = new InterestsSeeder();
  await interestSeeder.run(dataSource);

  const investmentSeeder = new InvestmentsSeeder();
  await investmentSeeder.run(dataSource);

  await dataSource.destroy();
}

runSeeders();
