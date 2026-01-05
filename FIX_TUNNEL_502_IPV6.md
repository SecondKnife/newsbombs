# Fix Tunnel 502 Error với Backend IPv6

## Vấn đề
Backend đang chạy và test local thành công, nhưng tunnel vẫn trả về 502.

## Nguyên nhân
Backend đang listen trên IPv6 (`tcp6`) nhưng tunnel config có thể cần chỉ định rõ ràng.

## Giải pháp

### Bước 1: Sửa tunnel config

```bash
sudo nano /etc/cloudflared/config.yml
```

### Bước 2: Thử các options sau

**Option 1: Dùng 127.0.0.1 thay vì localhost**
```yaml
protocol: http2

tunnel: 81411476-b07b-4073-972d-143f186a8312
credentials-file: /root/.cloudflared/81411476-b07b-4073-972d-143f186a8312.json

ingress:
  - hostname: api.nhatbinhkt.com
    service: http://127.0.0.1:3001  # Dùng 127.0.0.1 thay vì localhost
  - service: http_status:404
```

**Option 2: Dùng [::1] cho IPv6**
```yaml
protocol: http2

tunnel: 81411476-b07b-4073-972d-143f186a8312
credentials-file: /root/.cloudflared/81411476-b07b-4073-972d-143f186a8312.json

ingress:
  - hostname: api.nhatbinhkt.com
    service: http://[::1]:3001  # Dùng IPv6 localhost
  - service: http_status:404
```

**Option 3: Dùng 0.0.0.0 (nếu backend listen trên tất cả interfaces)**
```yaml
protocol: http2

tunnel: 81411476-b07b-4073-972d-143f186a8312
credentials-file: /root/.cloudflared/81411476-b07b-4073-972d-143f186a8312.json

ingress:
  - hostname: api.nhatbinhkt.com
    service: http://0.0.0.0:3001  # Dùng 0.0.0.0
  - service: http_status:404
```

### Bước 3: Test từng option

Sau mỗi lần sửa config:

```bash
# Validate config
cloudflared tunnel --config /etc/cloudflared/config.yml validate

# Restart tunnel (nếu đang chạy như service)
sudo systemctl restart cloudflared

# Hoặc nếu chạy manual, dừng (Ctrl+C) và chạy lại
TUNNEL_LOGLEVEL=debug cloudflared tunnel --config /etc/cloudflared/config.yml run
```

### Bước 4: Test tunnel

```bash
curl https://api.nhatbinhkt.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}'
```

## Khuyến nghị

**Thử Option 1 trước (127.0.0.1)** - thường work nhất.

Nếu không work, thử Option 2 (IPv6).

## Debug thêm

Nếu vẫn 502, xem tunnel logs để tìm lỗi cụ thể:

```bash
# Nếu chạy như service
sudo journalctl -u cloudflared -f

# Nếu chạy manual
# Xem terminal đang chạy tunnel
```

Tìm các dòng có:
- `502`
- `Bad Gateway`
- `connection refused`
- `dial tcp`

## Sau khi fix

Khi tunnel hoạt động:

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

