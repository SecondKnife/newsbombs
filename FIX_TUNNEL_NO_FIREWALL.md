# Fix Tunnel Connection khi Firewall đã tắt

## Vấn đề
Firewall (UFW) đã tắt nhưng tunnel vẫn không kết nối được. Có thể do:
1. iptables đang chặn
2. VPS provider firewall ở network level
3. Network connectivity issue

## Giải pháp

### Bước 1: Kiểm tra iptables

```bash
# Kiểm tra iptables rules
sudo iptables -L -n -v

# Kiểm tra NAT table
sudo iptables -t nat -L -n -v

# Nếu có rules chặn, xem chi tiết
sudo iptables -L -n -v | grep -i drop
sudo iptables -L -n -v | grep -i reject
```

### Bước 2: Kiểm tra network connectivity

```bash
# Test ping đến Cloudflare
ping -c 4 198.41.200.53

# Test DNS resolution
nslookup 198.41.200.53

# Test UDP port (nếu có nc)
nc -u -v -w 5 198.41.200.53 7844

# Hoặc dùng telnet cho TCP
telnet 198.41.200.53 443
```

### Bước 3: Kiểm tra VPS Provider Firewall

Một số VPS provider có firewall ở network level (không phải trên server):

**Kiểm tra:**
1. Vào VPS control panel (ví dụ: DigitalOcean, Linode, Vultr, AWS, Azure)
2. Tìm phần **Firewall**, **Security Groups**, hoặc **Network Security**
3. Kiểm tra xem có firewall rules nào đang chặn không
4. Mở ports: **7844 (UDP/TCP)**, **443 (UDP/TCP)**

### Bước 4: Thử force TCP protocol

Nếu UDP bị chặn ở network level, thử force TCP:

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

Restart:
```bash
sudo systemctl restart cloudflared
sudo journalctl -u cloudflared -f
```

### Bước 5: Kiểm tra DNS record

Đảm bảo DNS record đã được tạo trên Cloudflare:

1. Vào Cloudflare Dashboard → DNS
2. Kiểm tra có CNAME record:
   - **Name:** `api`
   - **Target:** `<TUNNEL_ID>.cfargotunnel.com`
   - **Proxy:** Proxied (orange cloud)

Nếu chưa có, tạo ngay.

### Bước 6: Test với verbose logging

Chạy tunnel với debug mode để xem chi tiết:

```bash
# Stop service
sudo systemctl stop cloudflared

# Chạy với debug logging
cloudflared tunnel --config /etc/cloudflared/config.yml run --loglevel debug
```

Xem output để tìm lỗi cụ thể.

### Bước 7: Kiểm tra network interface

```bash
# Kiểm tra network interfaces
ip addr show

# Kiểm tra routing
ip route show

# Kiểm tra default gateway
ip route | grep default
```

### Bước 8: Thử chạy tunnel từ thư mục khác

Đôi khi có vấn đề với permissions hoặc paths:

```bash
# Chạy từ home directory
cd ~
cloudflared tunnel --config /etc/cloudflared/config.yml run --loglevel debug
```

## Alternative: Dùng Quick Tunnel (tạm thời)

Nếu vẫn không work, có thể dùng Quick Tunnel để test:

```bash
# Tạo quick tunnel (không cần config)
cloudflared tunnel --url http://localhost:3001
```

Lệnh này sẽ tạo một temporary tunnel và hiển thị URL. Dùng URL này để test.

**Lưu ý:** Quick tunnel chỉ dùng để test, không dùng cho production.

## Kiểm tra VPS Provider

Nếu VPS của bạn là:
- **DigitalOcean:** Vào Networking → Firewalls
- **Linode:** Vào Network → Firewalls  
- **Vultr:** Vào Networking → Firewall
- **AWS:** Vào EC2 → Security Groups
- **Azure:** Vào Network Security Groups
- **Google Cloud:** Vào VPC Network → Firewall rules

Mở ports: **7844 (UDP/TCP)**, **443 (UDP/TCP)**

## Test sau khi fix

Sau khi fix, tunnel sẽ hiển thị:
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

