# NewsBombs Backend API

NestJS backend for NewsBombs admin system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup PostgreSQL database:
- Create a database named `newsbombs`
- Update `.env` file with your database credentials

3. Run migrations (auto-sync enabled in development):
```bash
npm run start:dev
```

4. Create admin user:
You can create an admin user directly in the database or use a seed script.

## Environment Variables

Copy `.env.example` to `.env` and update with your values.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login

### Articles
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get article by ID
- `GET /api/articles/slug/:slug` - Get article by slug
- `POST /api/articles` - Create article (requires auth)
- `PATCH /api/articles/:id` - Update article (requires auth)
- `DELETE /api/articles/:id` - Delete article (requires auth)
- `POST /api/articles/upload` - Upload image (requires auth)

## Running

Development:
```bash
npm run start:dev
```

Production:
```bash
npm run build
npm run start:prod
```
