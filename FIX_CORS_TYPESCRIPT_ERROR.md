# Fix TypeScript Error trong CORS Config

## Lỗi

```
src/main.ts:28:58 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
```

## Nguyên nhân

`allowedOrigins` array có thể chứa `undefined` values, và TypeScript không chắc chắn rằng sau khi filter, tất cả values đều là `string`.

## Giải pháp

Thay đổi từ:
```typescript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://nhatbinhkt.com',
  ...
].filter(Boolean);
```

Thành:
```typescript
const allowedOrigins: string[] = [
  process.env.FRONTEND_URL,
  'https://nhatbinhkt.com',
  ...
].filter((origin): origin is string => Boolean(origin));
```

## Cách sửa trên VPS

### Bước 1: Sửa file main.ts

```bash
cd /www/wwwroot/backend
nano src/main.ts
```

Tìm dòng này (khoảng dòng 17):
```typescript
  const allowedOrigins = [
```

Thay thành:
```typescript
  const allowedOrigins: string[] = [
```

Và tìm dòng này (khoảng dòng 23):
```typescript
  ].filter(Boolean); // Remove undefined values
```

Thay thành:
```typescript
  ].filter((origin): origin is string => Boolean(origin)); // Remove undefined values and ensure type safety
```

Lưu file: `Ctrl + O`, Enter, `Ctrl + X`

### Bước 2: Rebuild

```bash
npm run build
```

Nếu build thành công, tiếp tục:

```bash
# Restart PM2
pm2 restart newsbombs-backend

# Xem logs
pm2 logs newsbombs-backend --lines 50
```

## Hoặc copy toàn bộ đoạn code mới

Thay thế toàn bộ phần CORS config (từ dòng 15 đến 45) bằng:

```typescript
  // Enable CORS for frontend
  // Allow multiple origins for production and development
  const allowedOrigins: string[] = [
    process.env.FRONTEND_URL,
    'https://nhatbinhkt.com',
    'https://www.nhatbinhkt.com',
    'https://newsbombs.pages.dev',
    'http://localhost:3455', // Development
  ].filter((origin): origin is string => Boolean(origin)); // Remove undefined values and ensure type safety

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

