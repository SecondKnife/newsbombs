# Fix Cloudflare Tunnel Connection Error

## Vấn đề
Tunnel đã được cấu hình nhưng không thể kết nối đến Cloudflare edge servers:
```
ERR Failed to dial a quic connection error="failed to dial to edge with quic: timeout: no recent network activity"
```

## Nguyên nhân
Firewall trên VPS đang chặn kết nối QUIC (UDP) đến Cloudflare.

## Giải pháp

### Bước 1: Kiểm tra firewall

```bash
# Kiểm tra UFW status
sudo ufw status

# Hoặc nếu dùng firewalld
sudo firewall-cmd --list-all
```

### Bước 2: Mở ports cho Cloudflare Tunnel

Cloudflare Tunnel cần các ports sau:
- **UDP 7844** (QUIC protocol)
- **TCP 7844** (fallback)
- **UDP 443** (alternative)
- **TCP 443** (alternative)

#### Nếu dùng UFW (Ubuntu/Debian):

```bash
# Mở UDP 7844 (QUIC)
sudo ufw allow 7844/udp

# Mở TCP 7844 (fallback)
sudo ufw allow 7844/tcp

# Mở UDP 443 (alternative)
sudo ufw allow 443/udp

# Mở TCP 443 (alternative)
sudo ufw allow 443/tcp

# Hoặc mở tất cả từ Cloudflare IPs (khuyến nghị)
sudo ufw allow from 198.41.192.0/16
sudo ufw allow from 198.41.200.0/16

# Reload firewall
sudo ufw reload

# Kiểm tra lại
sudo ufw status
```

#### Nếu dùng firewalld (CentOS/RHEL):

```bash
# Mở ports
sudo firewall-cmd --permanent --add-port=7844/udp
sudo firewall-cmd --permanent --add-port=7844/tcp
sudo firewall-cmd --permanent --add-port=443/udp
sudo firewall-cmd --permanent --add-port=443/tcp

# Hoặc allow từ Cloudflare ranges
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="198.41.192.0/16" accept'
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="198.41.200.0/16" accept'

# Reload
sudo firewall-cmd --reload
```

### Bước 3: Kiểm tra network connectivity

```bash
# Test kết nối đến Cloudflare
ping 198.41.200.53

# Test UDP port
nc -u -v 198.41.200.53 7844

# Hoặc dùng telnet
telnet 198.41.200.53 443
```

### Bước 4: Thử force TCP protocol

Nếu UDP vẫn bị chặn, thử force TCP trong config:

```bash
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

### Bước 5: Restart tunnel

```bash
# Stop tunnel
sudo systemctl stop cloudflared

# Start lại
sudo systemctl start cloudflared

# Check logs
sudo journalctl -u cloudflared -f
```

### Bước 6: Kiểm tra DNS record

Đảm bảo DNS record đã được tạo:

1. Vào Cloudflare Dashboard → DNS
2. Kiểm tra có CNAME record:
   - Name: `api`
   - Target: `<TUNNEL_ID>.cfargotunnel.com`
   - Proxy: Proxied

## Alternative: Tắt firewall tạm thời để test

**CHỈ DÙNG ĐỂ TEST, KHÔNG DÙNG TRONG PRODUCTION!**

```bash
# Tắt UFW tạm thời
sudo ufw disable

# Hoặc tắt firewalld
sudo systemctl stop firewalld

# Test tunnel
sudo systemctl restart cloudflared
sudo journalctl -u cloudflared -f
```

Nếu tunnel hoạt động sau khi tắt firewall → Xác nhận firewall là nguyên nhân.

**Sau đó bật lại firewall và mở ports đúng cách:**

```bash
# Bật lại UFW
sudo ufw enable

# Mở ports như hướng dẫn ở trên
```

## Troubleshooting

### Vẫn không kết nối được sau khi mở ports

1. **Kiểm tra VPS provider firewall:**
   - Một số VPS provider có firewall ở network level
   - Vào VPS control panel và mở ports ở đó

2. **Kiểm tra iptables:**
   ```bash
   sudo iptables -L -n -v
   sudo iptables -L -n -v -t nat
   ```

3. **Thử chạy tunnel với verbose logging:**
   ```bash
   cloudflared tunnel --config /etc/cloudflared/config.yml run --loglevel debug
   ```

4. **Kiểm tra network interface:**
   ```bash
   ip addr show
   # Đảm bảo có IP address và network interface hoạt động
   ```

### Lỗi "credentials file not found"

```bash
# Kiểm tra credentials file
ls -la /root/.cloudflared/*.json

# Đảm bảo path trong config.yml đúng
cat /etc/cloudflared/config.yml
```

### Lỗi "hostname not found"

- Đảm bảo DNS record đã được tạo trên Cloudflare
- Đợi 1-2 phút để DNS propagate
- Kiểm tra: `dig api.nhatbinhkt.com`

## Sau khi fix

Khi tunnel kết nối thành công, bạn sẽ thấy:
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

