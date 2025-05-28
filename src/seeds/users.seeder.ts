import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export default class UsersSeeder extends Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const users: Partial<User>[] = [];

    for (let i = 0; i < 10; i++) {
      const password = await bcrypt.hash('password', 10); // hash identique pour tous

      users.push({
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        password,
        role: faker.helpers.arrayElement(['admin', 'entrepreneur', 'investor']),
      });
    }

    await dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .execute();
  }
}
