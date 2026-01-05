# Tunnel Đã Hoạt Động - Các Bước Tiếp Theo

## ✅ Tunnel đã hoạt động!

Cả hai test đều thành công:
- ✅ Backend local: `http://127.0.0.1:3001/api/auth/login` → Trả về token
- ✅ Tunnel endpoint: `https://api.nhatbinhkt.com/api/auth/login` → Trả về token

## Các bước tiếp theo

### Bước 1: Install Tunnel như Service

Để tunnel chạy tự động và không bị dừng khi đóng terminal:

```bash
# Dừng tunnel hiện tại (Ctrl+C trong terminal đang chạy tunnel)

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

### Bước 2: Cập nhật Environment Variable trên Cloudflare Pages

1. Vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Workers & Pages** → project **newsbombs**
3. **Settings** → **Environment Variables**
4. Tìm hoặc thêm biến:
   - **Variable name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://api.nhatbinhkt.com`
   - **Environment:** Production (và Preview nếu cần)
5. Click **Save**

### Bước 3: Redeploy Cloudflare Pages

Sau khi cập nhật Environment Variable:

1. Vào tab **Deployments**
2. Click **Retry deployment** hoặc push code mới lên GitHub
3. Đợi build hoàn tất

### Bước 4: Test Login trên Website

Sau khi deploy xong:

1. Vào `https://nhatbinhkt.com/admin/login`
2. Nhập:
   - **Email:** `admin@newsbombs.com`
   - **Password:** `admin123`
3. Click **Login**

Login sẽ hoạt động! 🎉

## Kiểm tra

### Test tunnel endpoint:
```bash
curl https://api.nhatbinhkt.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}'
```

### Test từ browser:
- Mở: `https://nhatbinhkt.com/admin/login`
- Login với credentials trên

## Troubleshooting

### Nếu login vẫn lỗi 500

1. **Kiểm tra Environment Variable:**
   - Đảm bảo `NEXT_PUBLIC_API_URL` = `https://api.nhatbinhkt.com`
   - Redeploy sau khi thay đổi

2. **Kiểm tra tunnel đang chạy:**
   ```bash
   sudo systemctl status cloudflared
   ```

3. **Kiểm tra backend đang chạy:**
   ```bash
   curl http://127.0.0.1:3001/api/auth/login \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@newsbombs.com","password":"admin123"}'
   ```

### Nếu tunnel service không start

```bash
# Check logs
sudo journalctl -u cloudflared -n 50

# Check config
cloudflared tunnel --config /etc/cloudflared/config.yml validate

# Restart service
sudo systemctl restart cloudflared
```

## Tóm tắt

✅ **Tunnel đã hoạt động!**
- Backend accessible qua `https://api.nhatbinhkt.com`
- Test endpoint thành công

📋 **Cần làm:**
1. Install tunnel như service
2. Cập nhật `NEXT_PUBLIC_API_URL` trên Cloudflare Pages
3. Redeploy
4. Test login trên website

🎉 **Sau đó login sẽ hoạt động hoàn toàn!**

