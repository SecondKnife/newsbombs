import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'], // Load from root or backend directory
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL || process.env.POSTGRES_URL
        ? {
            url: process.env.DATABASE_URL || process.env.POSTGRES_URL,
            ssl: { rejectUnauthorized: false }, // Required for Neon/cloud databases
          }
        : {
            host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME || process.env.POSTGRES_USER || 'postgres',
            password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
            database: process.env.DB_NAME || process.env.POSTGRES_DATABASE || 'newsbombs',
            ssl: (process.env.POSTGRES_HOST || process.env.DB_HOST) && 
                 !process.env.DB_HOST?.includes('localhost') && 
                 !process.env.POSTGRES_HOST?.includes('localhost')
                 ? { rejectUnauthorized: false }
                 : false,
          }),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    ArticlesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
