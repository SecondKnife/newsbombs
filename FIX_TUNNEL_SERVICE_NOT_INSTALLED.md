# Fix: Cloudflared Service Not Installed

## Vấn đề
Tunnel không chạy vì service chưa được install:
```
Failed to stop cloudflared.service: Unit cloudflared.service not loaded.
```

## Giải pháp

### Bước 1: Chạy tunnel với debug logging (đúng syntax)

Syntax đúng là `--loglevel` (2 dấu gạch ngang):

```bash
# Chạy với debug logging
cloudflared tunnel --config /etc/cloudflared/config.yml run --loglevel debug
```

Hoặc dùng environment variable:
```bash
TUNNEL_LOGLEVEL=debug cloudflared tunnel --config /etc/cloudflared/config.yml run
```

### Bước 2: Thử force TCP protocol

Nếu vẫn timeout với QUIC, thử force TCP:

```bash
# Edit config
sudo nano /etc/cloudflared/config.yml
```

Thêm dòng này vào đầu file:
```yaml
protocol: tcp  # Force TCP instead of QUIC

tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: api.nhatbinhkt.com
    service: http://localhost:3001
  - service: http_status:404
```

Sau đó chạy lại:
```bash
cloudflared tunnel --config /etc/cloudflared/config.yml run --loglevel debug
```

### Bước 3: Install như service

Sau khi test thành công, install như service:

```bash
# Install service
sudo cloudflared service install

# Start service
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared

# View logs
sudo journalctl -u cloudflared -f
```

### Bước 4: Kiểm tra config file

Đảm bảo config file đúng:

```bash
# Xem config
cat /etc/cloudflared/config.yml

# Validate config
cloudflared tunnel --config /etc/cloudflared/config.yml validate
```

### Bước 5: Kiểm tra credentials file

```bash
# Kiểm tra credentials file tồn tại
ls -la /root/.cloudflared/*.json

# Đảm bảo path trong config.yml đúng với file thực tế
```

## Debug Steps

### 1. Chạy với debug logging

```bash
cloudflared tunnel --config /etc/cloudflared/config.yml run --loglevel debug
```

Xem output để tìm lỗi cụ thể.

### 2. Kiểm tra backend đang chạy

```bash
# Kiểm tra backend có đang chạy không
curl http://localhost:3001/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}'
```

Nếu backend không chạy, start nó trước:
```bash
# Vào thư mục backend
cd /path/to/backend

# Start backend (tùy cách bạn đã setup)
npm run start:prod
# hoặc
pm2 start npm --name "backend" -- run start:prod
```

### 3. Test tunnel connection

Khi tunnel chạy thành công, bạn sẽ thấy:
```
INF +--------------------------------------------------------------------------------------------+
INF |  Your quick Tunnel has been created! Visit it: (it may take some time to be reachable)  |
INF +--------------------------------------------------------------------------------------------+
```

Sau đó test:
```bash
curl https://api.nhatbinhkt.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}'
```

## Common Issues

### Issue 1: "credentials file not found"

```bash
# Kiểm tra file tồn tại
ls -la /root/.cloudflared/*.json

# Nếu không có, cần tạo tunnel lại
cloudflared tunnel create backend-api
```

### Issue 2: "hostname not found"

- Đảm bảo DNS record đã được tạo trên Cloudflare
- Đợi 1-2 phút để DNS propagate

### Issue 3: "connection timeout"

- Thử force TCP protocol (xem Bước 2)
- Kiểm tra VPS provider firewall ở network level

## Next Steps

Sau khi tunnel chạy thành công:

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
   - Thử login với `admin@newsbombs.com` / `admin123`

