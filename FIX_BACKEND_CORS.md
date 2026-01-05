# Fix CORS Error cho Backend API

## Vấn đề

Frontend đang chạy trên `https://nhatbinhkt.com` nhưng backend CORS chỉ cho phép `FRONTEND_URL` (mặc định `http://localhost:3455`).

## Đã sửa

1. ✅ Update CORS config trong `backend/src/main.ts` để cho phép nhiều origins:
   - `https://nhatbinhkt.com`
   - `https://www.nhatbinhkt.com`
   - `https://newsbombs.pages.dev`
   - `http://localhost:3455` (development)
   - Giá trị từ `FRONTEND_URL` env variable

2. ✅ Thêm các methods và headers cần thiết

## Cần làm trên VPS

### Bước 1: Update code trên VPS

```bash
cd /www/wwwroot/backend
git pull origin main
```

### Bước 2: Update .env file

```bash
nano .env
```

Thêm hoặc update:
```env
FRONTEND_URL=https://nhatbinhkt.com
```

Lưu file: `Ctrl + O`, Enter, `Ctrl + X`

### Bước 3: Rebuild và restart

```bash
# Build lại
npm run build

# Restart PM2
pm2 restart newsbombs-backend

# Xem logs để đảm bảo không có lỗi
pm2 logs newsbombs-backend --lines 50
```

## Test sau khi fix

1. Mở `https://nhatbinhkt.com/admin/dashboard`
2. Kiểm tra Network tab trong DevTools
3. Request đến `https://api.nhatbinhkt.com/api/articles` phải thành công (200 OK)
4. Không còn CORS error

## Nếu vẫn lỗi

1. Kiểm tra logs backend:
```bash
pm2 logs newsbombs-backend --lines 100
```

2. Test CORS trực tiếp:
```bash
curl -H "Origin: https://nhatbinhkt.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Authorization" \
     -X OPTIONS \
     https://api.nhatbinhkt.com/api/articles \
     -v
```

3. Kiểm tra response headers có:
   - `Access-Control-Allow-Origin: https://nhatbinhkt.com`
   - `Access-Control-Allow-Credentials: true`
   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS`

