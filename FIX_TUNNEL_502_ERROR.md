# Fix Cloudflare Tunnel 502 Error

## Vấn đề
Tunnel đã kết nối thành công nhưng trả về lỗi 502 khi truy cập endpoint.

## Nguyên nhân
Backend service không đang chạy hoặc không accessible tại `http://localhost:3001`.

## Giải pháp

### Bước 1: Kiểm tra backend có đang chạy không

```bash
# Test backend local
curl http://localhost:3001/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}'
```

**Nếu lỗi "Connection refused" hoặc timeout:**
- Backend không đang chạy
- Cần start backend trước

### Bước 2: Kiểm tra backend đang listen trên port nào

```bash
# Kiểm tra port 3001 có process nào đang listen không
netstat -tlnp | grep 3001
# hoặc
ss -tlnp | grep 3001
# hoặc
lsof -i :3001
```

**Nếu không có process nào:**
- Backend không đang chạy
- Cần start backend

### Bước 3: Start backend

Tùy cách bạn đã setup backend:

**Nếu dùng PM2:**
```bash
# Kiểm tra PM2 processes
pm2 list

# Nếu backend không chạy, start nó
cd /path/to/backend
pm2 start npm --name "backend" -- run start:prod

# Hoặc nếu đã có PM2 config
pm2 start ecosystem.config.js
```

**Nếu chạy trực tiếp:**
```bash
cd /path/to/backend
npm run start:prod
```

**Nếu dùng systemd service:**
```bash
sudo systemctl start backend
sudo systemctl status backend
```

### Bước 4: Kiểm tra backend config

Đảm bảo backend đang listen trên:
- **Host:** `0.0.0.0` hoặc `localhost` (không phải chỉ `127.0.0.1`)
- **Port:** `3001`

Kiểm tra file config backend (thường là `.env` hoặc `config.ts`):
```bash
# Xem backend config
cat /path/to/backend/.env | grep PORT
# hoặc
cat /path/to/backend/src/main.ts | grep listen
```

### Bước 5: Test lại backend local

Sau khi start backend:

```bash
# Test backend local
curl http://localhost:3001/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}'
```

Nếu trả về token → Backend hoạt động.

### Bước 6: Test tunnel lại

Sau khi backend chạy, test tunnel:

```bash
curl https://api.nhatbinhkt.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}'
```

Nếu vẫn 502, kiểm tra tunnel logs:
```bash
# Nếu chạy như service
sudo journalctl -u cloudflared -f

# Nếu chạy manual
# Xem terminal đang chạy tunnel
```

### Bước 7: Kiểm tra tunnel config

Đảm bảo config đúng:

```bash
cat /etc/cloudflared/config.yml
```

Phải có:
```yaml
protocol: http2

tunnel: 81411476-b07b-4073-972d-143f186a8312
credentials-file: /root/.cloudflared/81411476-b07b-4073-972d-143f186a8312.json

ingress:
  - hostname: api.nhatbinhkt.com
    service: http://localhost:3001  # Đảm bảo đúng port
  - service: http_status:404
```

## Troubleshooting

### Backend chạy nhưng vẫn 502

1. **Kiểm tra backend có listen trên 0.0.0.0:**
   ```bash
   # Backend phải listen trên 0.0.0.0:3001, không phải 127.0.0.1:3001
   netstat -tlnp | grep 3001
   ```

2. **Kiểm tra firewall local:**
   ```bash
   # Đảm bảo không có firewall chặn localhost
   sudo iptables -L -n -v | grep 3001
   ```

3. **Test với IP thay vì localhost:**
   ```bash
   # Thử dùng 127.0.0.1 thay vì localhost trong config
   # Edit config
   sudo nano /etc/cloudflared/config.yml
   # Đổi: service: http://127.0.0.1:3001
   ```

### Backend không start được

1. **Kiểm tra logs:**
   ```bash
   # Nếu dùng PM2
   pm2 logs backend
   
   # Nếu chạy trực tiếp
   # Xem output trong terminal
   ```

2. **Kiểm tra database connection:**
   ```bash
   # Đảm bảo database đang chạy
   sudo systemctl status postgresql
   # hoặc
   sudo systemctl status mysql
   ```

3. **Kiểm tra environment variables:**
   ```bash
   cd /path/to/backend
   cat .env
   # Đảm bảo DATABASE_URL và các biến khác đúng
   ```

## Checklist

- [ ] Backend đang chạy trên port 3001
- [ ] Backend listen trên 0.0.0.0:3001 (không phải chỉ 127.0.0.1)
- [ ] Test backend local thành công
- [ ] Tunnel config đúng (service: http://localhost:3001)
- [ ] DNS record đã được tạo (api.nhatbinhkt.com)
- [ ] Tunnel đang chạy (service hoặc manual)

## Sau khi fix

Khi backend chạy và tunnel hoạt động:

1. **Test tunnel:**
   ```bash
   curl https://api.nhatbinhkt.com/api/auth/login \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@newsbombs.com","password":"admin123"}'
   ```

2. **Install tunnel như service:**
   ```bash
   sudo cloudflared service install
   sudo systemctl start cloudflared
   sudo systemctl enable cloudflared
   ```

3. **Cập nhật Environment Variable:**
   - Cloudflare Pages → Settings → Environment Variables
   - `NEXT_PUBLIC_API_URL` = `https://api.nhatbinhkt.com`
   - Redeploy

4. **Test login trên website:**
   - Vào `https://nhatbinhkt.com/admin/login`
   - Login với `admin@newsbombs.com` / `admin123`

