# Force TCP Protocol cho Cloudflare Tunnel

## Vấn đề
Tunnel đang dùng QUIC (UDP) và bị timeout. Cần force TCP protocol.

## Giải pháp: Force TCP trong config

### Bước 1: Edit config file

```bash
sudo nano /etc/cloudflared/config.yml
```

### Bước 2: Thêm protocol: tcp vào đầu file

Config file hiện tại có thể như này:
```yaml
tunnel: 81411476-b07b-4073-972d-143f186a8312
credentials-file: /root/.cloudflared/81411476-b07b-4073-972d-143f186a8312.json

ingress:
  - hostname: api.nhatbinhkt.com
    service: http://localhost:3001
  - service: http_status:404
```

**Sửa thành:**
```yaml
protocol: http2  # Force HTTP2 (TCP) instead of QUIC (UDP)

tunnel: 81411476-b07b-4073-972d-143f186a8312
credentials-file: /root/.cloudflared/81411476-b07b-4073-972d-143f186a8312.json

ingress:
  - hostname: api.nhatbinhkt.com
    service: http://localhost:3001
  - service: http_status:404
```

**Lưu ý:** Protocol phải là `http2` (không phải `tcp`). `http2` sử dụng TCP thay vì QUIC (UDP).

**Lưu ý:** Dòng `protocol: tcp` phải ở đầu file, trước `tunnel:`.

### Bước 3: Lưu file

- Nhấn `Ctrl+X`
- Nhấn `Y` để confirm
- Nhấn `Enter` để save

### Bước 4: Validate config

```bash
cloudflared tunnel --config /etc/cloudflared/config.yml validate
```

Nếu không có lỗi, sẽ hiển thị:
```
Valid configuration file
```

### Bước 5: Chạy lại tunnel

```bash
TUNNEL_LOGLEVEL=debug cloudflared tunnel --config /etc/cloudflared/config.yml run
```

Bây giờ bạn sẽ thấy:
```
DBG Fetched protocol: http2
INF Initial protocol http2
```

Thay vì:
```
DBG Fetched protocol: quic
INF Initial protocol quic
```

### Bước 6: Kiểm tra kết nối

Sau khi chạy với TCP, bạn sẽ thấy:
```
INF +--------------------------------------------------------------------------------------------+
INF |  Your quick Tunnel has been created! Visit it: (it may take some time to be reachable)  |
INF +--------------------------------------------------------------------------------------------+
```

Thay vì các lỗi timeout.

## Sau khi tunnel kết nối thành công

### 1. Test tunnel

```bash
# Trong terminal khác hoặc sau khi tunnel đã chạy
curl https://api.nhatbinhkt.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}'
```

### 2. Install như service

Sau khi test thành công, install như service:

```bash
# Stop tunnel hiện tại (Ctrl+C)

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

### 3. Cập nhật Environment Variable

1. Vào Cloudflare Pages → Settings → Environment Variables
2. Cập nhật `NEXT_PUBLIC_API_URL`: `https://api.nhatbinhkt.com`
3. Redeploy

### 4. Test login

Vào `https://nhatbinhkt.com/admin/login` và thử login!

## Troubleshooting

### Nếu vẫn timeout với TCP

1. **Kiểm tra backend đang chạy:**
   ```bash
   curl http://localhost:3001/api/auth/login \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@newsbombs.com","password":"admin123"}'
   ```

2. **Kiểm tra DNS record:**
   - Vào Cloudflare Dashboard → DNS
   - Đảm bảo có CNAME: `api` → `<TUNNEL_ID>.cfargotunnel.com` (Proxied)

3. **Kiểm tra VPS provider firewall:**
   - Vào VPS control panel
   - Mở TCP ports: 443, 7844

### Config file đầy đủ (reference)

```yaml
protocol: http2  # Use HTTP2 (TCP) instead of QUIC (UDP)

tunnel: 81411476-b07b-4073-972d-143f186a8312
credentials-file: /root/.cloudflared/81411476-b07b-4073-972d-143f186a8312.json

ingress:
  - hostname: api.nhatbinhkt.com
    service: http://localhost:3001
  - service: http_status:404
```

**Lưu ý:** 
- `protocol: http2` → Sử dụng TCP (HTTP/2)
- `protocol: quic` → Sử dụng UDP (QUIC) - default
- `protocol: auto` → Tự động chọn protocol tốt nhất

