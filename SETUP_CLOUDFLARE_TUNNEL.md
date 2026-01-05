# Setup Cloudflare Tunnel cho Backend API

## Vấn đề
Cloudflare Pages Edge Runtime **KHÔNG cho phép** fetch đến HTTP URLs vì lý do bảo mật. Cần setup HTTPS cho backend.

## Giải pháp: Cloudflare Tunnel (Dễ nhất, không cần SSL trên VPS)

Cloudflare Tunnel tạo một kết nối an toàn từ VPS đến Cloudflare, cho phép backend HTTP của bạn accessible qua HTTPS mà không cần cấu hình SSL trên VPS.

## Bước 1: Cài đặt cloudflared trên VPS

SSH vào VPS và chạy:

```bash
# Download cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Cài đặt
sudo dpkg -i cloudflared-linux-amd64.deb

# Hoặc nếu dùng CentOS/RHEL:
# wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-x86_64.rpm
# sudo rpm -i cloudflared-linux-x86_64.rpm
```

## Bước 2: Đăng nhập Cloudflare

```bash
cloudflared tunnel login
```

Lệnh này sẽ mở browser để bạn đăng nhập và authorize. Chọn domain `nhatbinhkt.com` (hoặc domain bạn đang dùng).

## Bước 3: Tạo Tunnel

```bash
# Tạo tunnel mới
cloudflared tunnel create backend-api

# Lưu ý: Ghi lại Tunnel ID được tạo (sẽ cần dùng sau)
```

## Bước 4: Tạo Config File

Tạo file config:

```bash
sudo mkdir -p /etc/cloudflared
sudo nano /etc/cloudflared/config.yml
```

Nội dung file:

```yaml
tunnel: <TUNNEL_ID>  # Thay bằng Tunnel ID từ bước 3
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  # Route backend API
  - hostname: api.nhatbinhkt.com  # Hoặc subdomain bạn muốn
    service: http://localhost:3001
  # Catch-all rule (phải ở cuối)
  - service: http_status:404
```

**Lưu ý:** Thay `<TUNNEL_ID>` bằng Tunnel ID thực tế.

## Bước 5: Tạo DNS Record

Tạo DNS record trên Cloudflare:

1. Vào Cloudflare Dashboard → DNS
2. Thêm record:
   - **Type:** CNAME
   - **Name:** `api` (hoặc subdomain bạn muốn)
   - **Target:** `<TUNNEL_ID>.cfargotunnel.com`
   - **Proxy status:** Proxied (orange cloud)

## Bước 6: Chạy Tunnel

### Option 1: Chạy thủ công (để test)

```bash
cloudflared tunnel --config /etc/cloudflared/config.yml run
```

### Option 2: Chạy như service (khuyến nghị)

```bash
# Install như systemd service
sudo cloudflared service install

# Start service
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared
```

## Bước 7: Test Tunnel

Sau khi tunnel chạy, test:

```bash
curl https://api.nhatbinhkt.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}'
```

Nếu trả về token → Tunnel hoạt động!

## Bước 8: Cập nhật Environment Variable

1. Vào Cloudflare Pages → Settings → Environment Variables
2. Cập nhật `NEXT_PUBLIC_API_URL`:
   - **Old:** `http://157.66.100.32:3001`
   - **New:** `https://api.nhatbinhkt.com`
3. Click **Save**
4. Redeploy

## Bước 9: Cập nhật Code

Sau khi có HTTPS endpoint, code sẽ tự động hoạt động vì đã dùng `NEXT_PUBLIC_API_URL`.

## Troubleshooting

### Tunnel không start
```bash
# Check logs
sudo journalctl -u cloudflared -f

# Check config
cloudflared tunnel --config /etc/cloudflared/config.yml validate
```

### DNS chưa propagate
- Đợi 1-2 phút sau khi tạo DNS record
- Kiểm tra: `dig api.nhatbinhkt.com`

### Backend không accessible
- Đảm bảo backend đang chạy trên port 3001
- Check firewall: `sudo ufw status`
- Test local: `curl http://localhost:3001/api/auth/login`

## Alternative: Setup HTTPS trực tiếp trên VPS

Nếu không muốn dùng Tunnel, có thể setup HTTPS với Let's Encrypt:

```bash
# Cài Certbot
sudo apt install certbot python3-certbot-nginx

# Tạo certificate
sudo certbot --nginx -d api.nhatbinhkt.com

# Hoặc nếu dùng standalone backend (không có nginx):
sudo certbot certonly --standalone -d api.nhatbinhkt.com
```

Sau đó cấu hình backend để sử dụng SSL certificate.

## Kết luận

**Cloudflare Tunnel là cách dễ nhất và nhanh nhất** để có HTTPS cho backend mà không cần cấu hình SSL trên VPS. Sau khi setup xong, login sẽ hoạt động ngay!

