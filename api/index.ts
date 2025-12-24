// Vercel Serverless Function adapter for NestJS backend
// Using dynamic imports to avoid Next.js compiling backend code during build

let cachedApp: any;

async function createApp(): Promise<any> {
  if (cachedApp) {
    return cachedApp;
  }

  // Use require() to prevent Next.js from compiling backend during build
  // These will be resolved at runtime by Vercel serverless function
  const { NestFactory } = require('@nestjs/core');
  const { ExpressAdapter } = require('@nestjs/platform-express');
  const { AppModule } = require('../backend/src/app.module');
  const express = require('express');
  const { ValidationPipe } = require('@nestjs/common');
  const bodyParser = require('body-parser');

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Increase body size limit for large content with images
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  // Serve static files (if needed)
  // Note: Vercel handles static files differently, consider using Vercel Blob Storage
  // app.useStaticAssets(join(__dirname, '..', 'backend', 'uploads'), {
  //   prefix: '/uploads',
  // });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  cachedApp = expressApp;
  return expressApp;
}

export default async function handler(req: any, res: any) {
  const app = await createApp();
  return app(req, res);
}

