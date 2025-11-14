import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/user.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'newsbombs',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  // Check if admin user exists
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@newsbombs.com' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = userRepository.create({
      username: 'admin',
      email: 'admin@newsbombs.com',
      password: hashedPassword,
      name: 'Admin User',
      isAdmin: true,
    });
    await userRepository.save(adminUser);
    console.log('Admin user created:');
    console.log('Email: admin@newsbombs.com');
    console.log('Password: admin123');
  } else {
    console.log('Admin user already exists');
  }

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});

