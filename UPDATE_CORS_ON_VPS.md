# Update CORS trên VPS - Không dùng Git

## Cách 1: Sửa trực tiếp file trên VPS (Nhanh nhất)

### Bước 1: Backup file cũ

```bash
cd /www/wwwroot/backend
cp src/main.ts src/main.ts.backup
```

### Bước 2: Sửa file main.ts

```bash
nano src/main.ts
```

Tìm dòng này (khoảng dòng 15-19):
```typescript
  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3455',
    credentials: true,
  });
```

Thay thế bằng:
```typescript
  // Enable CORS for frontend
  // Allow multiple origins for production and development
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://nhatbinhkt.com',
    'https://www.nhatbinhkt.com',
    'https://newsbombs.pages.dev',
    'http://localhost:3455', // Development
  ].filter(Boolean); // Remove undefined values

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.some(allowed => origin.includes(allowed))) {
        callback(null, true);
      } else {
        // For development, allow all origins
        if (process.env.NODE_ENV !== 'production') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
```

Lưu file: `Ctrl + O`, Enter, `Ctrl + X`

### Bước 3: Update .env file

```bash
nano .env
```

Thêm hoặc update:
```env
FRONTEND_URL=https://nhatbinhkt.com
```

Lưu file: `Ctrl + O`, Enter, `Ctrl + X`

### Bước 4: Rebuild và restart

```bash
# Build lại
npm run build

# Restart PM2
pm2 restart newsbombs-backend

# Xem logs để đảm bảo không có lỗi
pm2 logs newsbombs-backend --lines 50
```

## Cách 2: Clone lại repository từ GitHub

Nếu muốn dùng Git để quản lý code:

```bash
# Backup thư mục cũ (nếu cần)
cd /www/wwwroot
mv backend backend.backup

# Clone repository
git clone https://github.com/SecondKnife/newsbombs.git temp-repo

# Copy backend folder
cp -r temp-repo/backend .

# Xóa temp repo
rm -rf temp-repo

# Vào thư mục backend
cd backend

# Cài đặt dependencies
npm install --production

# Update .env
nano .env
# Thêm: FRONTEND_URL=https://nhatbinhkt.com

# Build
npm run build

# Restart PM2
pm2 restart newsbombs-backend
```

## Test sau khi fix

1. Mở `https://nhatbinhkt.com/admin/dashboard`
2. Kiểm tra Network tab trong DevTools
3. Request đến `https://api.nhatbinhkt.com/api/articles` phải thành công (200 OK)
4. Không còn CORS error

## Nếu vẫn lỗi

Kiểm tra logs backend:
```bash
pm2 logs newsbombs-backend --lines 100
```

Test CORS trực tiếp:
```bash
curl -H "Origin: https://nhatbinhkt.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Authorization" \
     -X OPTIONS \
     https://api.nhatbinhkt.com/api/articles \
     -v
```

Response phải có headers:
- `Access-Control-Allow-Origin: https://nhatbinhkt.com`
- `Access-Control-Allow-Credentials: true`

