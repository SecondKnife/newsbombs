# Fix Tunnel 404 Error

## Vấn đề
Tunnel đã kết nối nhưng trả về 404 Not Found khi truy cập endpoint.

## Nguyên nhân
Có thể do:
1. Ingress rule không match đúng
2. Backend route không đúng
3. Request method không đúng (GET vs POST)

## Giải pháp

### Bước 1: Kiểm tra config file

```bash
cat /etc/cloudflared/config.yml
```

Đảm bảo config đúng:
```yaml
protocol: http2

tunnel: 81411476-b07b-4073-972d-143f186a8312
credentials-file: /root/.cloudflared/81411476-b07b-4073-972d-143f186a8312.json

ingress:
  - hostname: api.nhatbinhkt.com
    service: http://127.0.0.1:3001
  - service: http_status:404
```

### Bước 2: Test backend local với POST

Đảm bảo backend nhận POST request:

```bash
# Test với POST (đúng method)
curl http://127.0.0.1:3001/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}'
```

Nếu trả về token → Backend hoạt động đúng.

### Bước 3: Test với GET (để xem backend response)

```bash
# Test với GET
curl http://127.0.0.1:3001/api/auth/login
```

Nếu trả về 404 → Backend chỉ nhận POST, đây là bình thường.

### Bước 4: Kiểm tra backend route

Đảm bảo backend có route:
- `POST /api/auth/login`

Kiểm tra backend code:
```bash
# Xem backend routes (tùy cách bạn setup)
# Nếu dùng NestJS, kiểm tra auth.controller.ts
```

### Bước 5: Test tunnel với POST request

Sau khi tunnel chạy lại, test với POST:

```bash
curl https://api.nhatbinhkt.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}'
```

**Lưu ý:** Phải dùng `-X POST`, không phải GET.

### Bước 6: Xem tunnel logs khi test

Khi test, xem logs trong terminal đang chạy tunnel để thấy:
- Request method (GET hay POST)
- Path được forward
- Response từ backend

## Troubleshooting

### Nếu vẫn 404

1. **Kiểm tra backend có route `/api/auth/login` không:**
   ```bash
   # Test local với đúng path
   curl http://127.0.0.1:3001/api/auth/login \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@newsbombs.com","password":"admin123"}'
   ```

2. **Kiểm tra backend base path:**
   - Backend có thể có base path khác (ví dụ: `/api` đã được include trong route)
   - Kiểm tra backend code để xem route thực tế

3. **Thử với path khác:**
   ```bash
   # Test root path
   curl https://api.nhatbinhkt.com/
   
   # Test health check (nếu có)
   curl https://api.nhatbinhkt.com/health
   ```

### Nếu lỗi 1033

Lỗi 1033 = Tunnel không chạy. Cần start tunnel lại:

```bash
# Chạy tunnel
TUNNEL_LOGLEVEL=debug cloudflared tunnel --config /etc/cloudflared/config.yml run

# Hoặc install như service
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

## Sau khi fix

Khi tunnel hoạt động và trả về token:

1. **Install như service:**
   ```bash
   sudo cloudflared service install
   sudo systemctl start cloudflared
   sudo systemctl enable cloudflared
   ```

2. **Cập nhật Environment Variable:**
   - Cloudflare Pages → Settings → Environment Variables
   - `NEXT_PUBLIC_API_URL` = `https://api.nhatbinhkt.com`
   - Redeploy

3. **Test login:**
   - Vào `https://nhatbinhkt.com/admin/login`
   - Login với `admin@newsbombs.com` / `admin123`

