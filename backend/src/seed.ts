import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { resolve } from 'path';
import { User } from './users/user.entity';

// Load .env file from root or backend directory
config({ path: resolve(__dirname, '../../.env') });
config({ path: resolve(__dirname, '../.env') });

async function seed() {
  // Support both connection string and individual parameters
  let dataSourceConfig: any;
  
  if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
    // Use connection string if available
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    dataSourceConfig = {
      type: 'postgres',
      url: connectionString,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables for seed
      ssl: { rejectUnauthorized: false }, // Required for Neon
    };
  } else {
    // Use individual parameters
    dataSourceConfig = {
      type: 'postgres',
      host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || process.env.POSTGRES_USER || 'postgres',
      password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.DB_NAME || process.env.POSTGRES_DATABASE || 'newsbombs',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables for seed
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  }

  const dataSource = new DataSource(dataSourceConfig);

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

