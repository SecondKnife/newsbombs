import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';
import { User } from './users/user.entity';
import { Article } from './articles/article.entity';

// Load .env file from root or backend directory
config({ path: resolve(__dirname, '../../.env') });
config({ path: resolve(__dirname, '../.env') });

interface ArticleData {
  title: string;
  summary?: string;
  content: string;
  slug: string;
  date: string;
  lastmod?: string;
  tags?: string[];
  images?: string[];
  draft?: boolean;
  layout?: string;
}

async function importArticles() {
  // Check for JSON file path argument
  const jsonFilePath = process.argv[2];
  
  if (!jsonFilePath) {
    console.log('Usage: npx ts-node src/import-articles.ts <path-to-json-file>');
    console.log('Example: npx ts-node src/import-articles.ts ./articles.json');
    console.log('\nJSON file format:');
    console.log(JSON.stringify([
      {
        title: "Article Title",
        summary: "Short description",
        content: "Full content with **markdown** support",
        slug: "article-slug",
        date: "2024-11-29",
        tags: ["tag1", "tag2"],
        images: ["/static/images/image.jpg"],
        draft: false
      }
    ], null, 2));
    process.exit(1);
  }

  // Check if file exists
  const absolutePath = resolve(process.cwd(), jsonFilePath);
  if (!existsSync(absolutePath)) {
    console.error(`❌ File not found: ${absolutePath}`);
    process.exit(1);
  }

  // Read and parse JSON file
  let articles: ArticleData[];
  try {
    const fileContent = readFileSync(absolutePath, 'utf-8');
    articles = JSON.parse(fileContent);
    
    if (!Array.isArray(articles)) {
      articles = [articles]; // Support single object
    }
  } catch (error) {
    console.error('❌ Error parsing JSON file:', error);
    process.exit(1);
  }

  console.log(`📖 Found ${articles.length} article(s) in file`);

  // Setup database connection
  let dataSourceConfig: any;
  
  if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    dataSourceConfig = {
      type: 'postgres',
      url: connectionString,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    };
  } else {
    dataSourceConfig = {
      type: 'postgres',
      host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432'),
      username: process.env.DB_USERNAME || process.env.POSTGRES_USER || 'postgres',
      password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.DB_NAME || process.env.POSTGRES_DATABASE || 'newsbombs',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  }

  const dataSource = new DataSource(dataSourceConfig);
  await dataSource.initialize();
  console.log('✅ Connected to database');

  const userRepository = dataSource.getRepository(User);
  const articleRepository = dataSource.getRepository(Article);

  // Get or create admin user
  let adminUser = await userRepository.findOne({
    where: { email: 'admin@newsbombs.com' },
  });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    adminUser = userRepository.create({
      username: 'admin',
      email: 'admin@newsbombs.com',
      password: hashedPassword,
      name: 'Admin User',
      isAdmin: true,
    });
    await userRepository.save(adminUser);
    console.log('✅ Created admin user');
  }

  // Import articles
  console.log('\n📰 Importing articles...');
  let imported = 0;
  let updated = 0;
  let skipped = 0;

  for (const articleData of articles) {
    try {
      // Check if article with same slug exists
      const existingArticle = await articleRepository.findOne({
        where: { slug: articleData.slug }
      });

      if (existingArticle) {
        // Update existing article
        existingArticle.title = articleData.title;
        existingArticle.summary = articleData.summary || '';
        existingArticle.content = articleData.content;
        existingArticle.date = new Date(articleData.date);
        existingArticle.lastmod = articleData.lastmod ? new Date(articleData.lastmod) : new Date();
        existingArticle.tags = articleData.tags || [];
        existingArticle.images = articleData.images || [];
        existingArticle.draft = articleData.draft || false;
        existingArticle.layout = articleData.layout || 'PostLayout';
        
        await articleRepository.save(existingArticle);
        console.log(`  🔄 Updated: ${articleData.title}`);
        updated++;
      } else {
        // Create new article
        const article = new Article();
        article.title = articleData.title;
        article.summary = articleData.summary || '';
        article.content = articleData.content;
        article.slug = articleData.slug;
        article.date = new Date(articleData.date);
        article.lastmod = articleData.lastmod ? new Date(articleData.lastmod) : null as any;
        article.tags = articleData.tags || [];
        article.images = articleData.images || [];
        article.draft = articleData.draft || false;
        article.layout = articleData.layout || 'PostLayout';
        article.authorId = adminUser.id;
        
        await articleRepository.save(article);
        console.log(`  ✅ Created: ${articleData.title}`);
        imported++;
      }
    } catch (error) {
      console.error(`  ❌ Error importing "${articleData.title}":`, error);
      skipped++;
    }
  }

  console.log('\n📊 Import Summary:');
  console.log(`  ✅ New articles: ${imported}`);
  console.log(`  🔄 Updated: ${updated}`);
  console.log(`  ❌ Skipped: ${skipped}`);
  console.log(`  📰 Total: ${articles.length}`);

  await dataSource.destroy();
  console.log('\n✅ Done!');
}

importArticles().catch((error) => {
  console.error('Error importing articles:', error);
  process.exit(1);
});

