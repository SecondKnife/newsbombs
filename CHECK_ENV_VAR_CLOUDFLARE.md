# Kiểm Tra Environment Variable trên Cloudflare Pages

## Vấn đề

API route đang trả về 500 vì có thể:
1. Environment variable `NEXT_PUBLIC_API_URL` chưa được set trên Cloudflare Pages
2. Hoặc giá trị không đúng

## Cách kiểm tra và sửa

### Bước 1: Vào Cloudflare Dashboard

1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Chọn account của bạn
3. Vào **Workers & Pages**
4. Click vào project **newsbombs**

### Bước 2: Kiểm tra Environment Variables

1. Click tab **Settings** (bên trái)
2. Scroll xuống phần **Environment Variables**
3. Tìm biến `NEXT_PUBLIC_API_URL`

### Bước 3: Thêm hoặc Sửa Environment Variable

**Nếu chưa có:**
1. Click **Add variable**
2. Nhập:
   - **Variable name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://api.nhatbinhkt.com`
   - **Environment:** Chọn **Production** (và **Preview** nếu muốn)
3. Click **Save**

**Nếu đã có nhưng sai:**
1. Click vào biến `NEXT_PUBLIC_API_URL`
2. Sửa **Value** thành: `https://api.nhatbinhkt.com`
3. Đảm bảo **Environment** là **Production**
4. Click **Save**

### Bước 4: Redeploy

Sau khi cập nhật Environment Variable:

1. Vào tab **Deployments**
2. Tìm deployment mới nhất
3. Click **Retry deployment** hoặc đợi auto-deploy từ GitHub

### Bước 5: Kiểm tra Logs

Sau khi deploy xong, test login và xem logs:

1. Vào **Workers & Pages** → **newsbombs** → **Deployments**
2. Click vào deployment mới nhất
3. Click tab **Functions** hoặc **Logs**
4. Tìm log từ `/api/auth/login`
5. Xem log có dòng:
   - `[getApiBaseUrl] Method 1 (process.env): https://api.nhatbinhkt.com`
   - `[getApiBaseUrl] Found API URL: https://api.nhatbinhkt.com`
   - `Forwarding login request to: https://api.nhatbinhkt.com/api/auth/login`

## Lưu ý

- Environment variable phải là **Production** để áp dụng cho domain `nhatbinhkt.com`
- Sau khi thay đổi Environment Variable, **bắt buộc phải redeploy** mới có hiệu lực
- Nếu không set Environment Variable, code sẽ dùng fallback: `https://api.nhatbinhkt.com` (đã được sửa)

## Test

Sau khi redeploy:

```bash
# Test từ browser
https://nhatbinhkt.com/admin/login

# Hoặc test API trực tiếp
curl https://nhatbinhkt.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}'
```

## Troubleshooting

### Nếu vẫn lỗi 500

1. **Kiểm tra tunnel đang chạy:**
   ```bash
   # Trên VPS
   sudo systemctl status cloudflared
   ```

2. **Test tunnel endpoint:**
   ```bash
   curl https://api.nhatbinhkt.com/api/auth/login \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@newsbombs.com","password":"admin123"}'
   ```

3. **Kiểm tra logs trên Cloudflare:**
   - Vào **Workers & Pages** → **newsbombs** → **Deployments** → **Functions/Logs**
   - Xem error message chi tiết

### Nếu Environment Variable không áp dụng

- Đảm bảo đã chọn **Production** environment
- Đảm bảo đã **Save** và **Redeploy**
- Đợi vài phút để deployment hoàn tất

