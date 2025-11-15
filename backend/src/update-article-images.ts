import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';
import { Article } from './articles/article.entity';

// Load .env file from root or backend directory
config({ path: resolve(__dirname, '../../.env') });
config({ path: resolve(__dirname, '../.env') });

async function updateImages() {
  // Support both connection string and individual parameters
  let dataSourceConfig: any;
  
  if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    dataSourceConfig = {
      type: 'postgres',
      url: connectionString,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      ssl: { rejectUnauthorized: false },
    };
  } else {
    dataSourceConfig = {
      type: 'postgres',
      host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || process.env.POSTGRES_USER || 'postgres',
      password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.DB_NAME || process.env.POSTGRES_DATABASE || 'newsbombs',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  }

  const dataSource = new DataSource(dataSourceConfig);
  await dataSource.initialize();

  const articleRepository = dataSource.getRepository(Article);

  // Map of slugs to new images
  const imageUpdates: Record<string, string[]> = {
    'vietnam-tech-startup-funding-2024': ['/static/images/github-traffic.png', '/imgs/openapi.png'],
    'vietnam-ai-development-2024': ['/static/images/debug-in-nodejs.png', '/imgs/dthc_cpp.png'],
    'vietnam-5g-network-expansion': ['/static/images/ocean.jpeg', '/imgs/trucking.jpeg'],
    'vietnam-cybersecurity-2024': ['/static/images/google.png', '/imgs/dtite.png'],
    'vietnam-ecommerce-growth-2024': ['/imgs/shop.jpg', '/imgs/buysimvietnam.au.jpeg'],
    'vietnam-green-energy-transition': ['/static/images/canada/mountains.jpg', '/static/images/canada/lake.jpg'],
  };

  console.log('🖼️  Updating article images...\n');

  for (const [slug, images] of Object.entries(imageUpdates)) {
    const article = await articleRepository.findOne({ where: { slug } });
    if (article) {
      article.images = images;
      await articleRepository.save(article);
      console.log(`  ✓ Updated: ${article.title}`);
      console.log(`    Images: ${images.join(', ')}`);
    } else {
      console.log(`  ⚠ Article not found: ${slug}`);
    }
  }

  console.log('\n✅ Images updated successfully!');

  await dataSource.destroy();
}

updateImages().catch((error) => {
  console.error('Error updating images:', error);
  process.exit(1);
});

