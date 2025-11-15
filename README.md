# NewsBombs - Modern News Website

A modern news website built with Next.js (Frontend) and NestJS (Backend), featuring a beautiful UI with animated backgrounds, article management system, and admin panel.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 15.4.5
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui, Radix UI
- **Animations:** Framer Motion
- **Content:** MDX (Markdown + JSX)

### Backend
- **Framework:** NestJS
- **Database:** PostgreSQL (Neon)
- **ORM:** TypeORM
- **Authentication:** JWT, Passport
- **File Upload:** Multer

## 📋 Prerequisites

Before running the project, make sure you have installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (or Neon account for cloud database)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd newsbombs
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration (PostgreSQL/Neon)
DATABASE_URL=your_database_connection_string
# OR use individual parameters:
POSTGRES_HOST=your_host
POSTGRES_PORT=5432
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=newsbombs

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_key

# Backend Port (optional, default: 3001)
PORT=3001

# Frontend Port (optional, default: 3455)
# Configured in package.json
```

**Note:** If you're using Neon (cloud PostgreSQL), you can use the `DATABASE_URL` or `POSTGRES_URL` directly.

## 🗄️ Database Setup

### Option 1: Using Neon (Cloud PostgreSQL)

1. Sign up at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env` file as `DATABASE_URL`

### Option 2: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database named `newsbombs`
3. Update `.env` with your local database credentials

### Seed Database

After setting up your database, run the seed script to create an admin user:

```bash
npm run backend:seed
```

This will create an admin user with:
- **Email:** admin@newsbombs.com
- **Password:** admin123

**⚠️ Important:** Change the admin password after first login!

## 🏃 Running the Project

### Development Mode

#### Start Backend (Terminal 1)

```bash
npm run backend:dev
```

Backend will run on: `http://localhost:3001`

#### Start Frontend (Terminal 2)

```bash
npm run dev
```

Frontend will run on: `http://localhost:3455`

### Production Mode

#### Build Frontend

```bash
npm run build
```

#### Start Frontend

```bash
npm start
```

#### Build Backend

```bash
cd backend
npm run build
```

#### Start Backend

```bash
cd backend
npm run start:prod
```

## 📁 Project Structure

```
newsbombs/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   ├── blog/              # Blog/news pages
│   ├── projects/          # Projects page
│   ├── tags/              # Tags page
│   └── page.tsx           # Home page
├── backend/               # NestJS backend
│   ├── src/
│   │   ├── articles/      # Article management
│   │   ├── auth/          # Authentication
│   │   ├── users/         # User management
│   │   └── main.ts        # Entry point
│   └── package.json
├── components/            # React components
│   ├── home/              # Home page components
│   ├── ui/                # UI components (Shadcn)
│   └── ...
├── data/                  # Static data and MDX files
│   ├── blog/              # Blog posts (MDX)
│   └── ...
├── lib/                   # Utility functions
├── public/                # Static assets
│   ├── background.jpg     # Background image (add your own)
│   └── ...
└── package.json
```

## 🎨 Features

### Frontend Features
- ✅ Modern news website layout
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Animated background with blur effect
- ✅ Article listing and detail pages
- ✅ Tag-based filtering
- ✅ Search functionality
- ✅ Admin panel for content management

### Backend Features
- ✅ RESTful API
- ✅ JWT authentication
- ✅ Article CRUD operations
- ✅ User management
- ✅ File upload support
- ✅ PostgreSQL database integration

## 🔐 Admin Panel

Access the admin panel at: `http://localhost:3455/admin/login`

**Default Credentials:**
- Email: `admin@newsbombs.com`
- Password: `admin123`

**⚠️ Security Note:** Change the default password immediately after first login!

## 📝 Adding Background Image

To add a custom background image:

1. Place your image file in the `public/` directory
2. Name it `background.jpg`
3. The image will automatically be used as a blurred background

If the image is not found, a gradient fallback will be displayed.

## 🛠️ Available Scripts

### Frontend Scripts

```bash
npm run dev          # Start development server (port 3455)
npm run build        # Build for production
npm run start        # Start production server (port 3465)
npm run lint         # Run ESLint
```

### Backend Scripts

```bash
npm run backend:dev  # Start backend in development mode
npm run backend:seed # Seed database with admin user
```

## 🐛 Troubleshooting

### Port Already in Use

If you get an error that port 3455 or 3001 is already in use:

**Windows:**
```powershell
# Find process using port 3455
netstat -ano | findstr :3455

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find and kill process using port 3455
lsof -ti:3455 | xargs kill -9
```

### Database Connection Issues

1. Check your `.env` file has correct database credentials
2. For Neon, ensure `DATABASE_URL` includes SSL parameters
3. Verify database is running (if local)
4. Check firewall settings if using cloud database

### Image Not Displaying

1. Ensure `background.jpg` exists in `public/` directory
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for 404 errors

### TypeScript Errors

If you see TypeScript errors related to backend code:

1. Ensure `tsconfig.json` excludes `backend/` directory
2. Restart the development server

## 📚 API Endpoints

### Authentication
- `POST /auth/login` - Login
- `POST /auth/register` - Register new user

### Articles
- `GET /articles` - Get all articles
- `GET /articles/:id` - Get article by ID
- `POST /articles` - Create article (Admin only)
- `PUT /articles/:id` - Update article (Admin only)
- `DELETE /articles/:id` - Delete article (Admin only)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👤 Author

**Tai Tran Dinh**

- LinkedIn: [@tai-tran-0b68a9187](https://www.linkedin.com/in/tai-tran-0b68a9187/)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- NestJS team for the robust backend framework
- Shadcn for beautiful UI components
- All contributors and open-source libraries used in this project

---

**Happy Coding! 🚀**
