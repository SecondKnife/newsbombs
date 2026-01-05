# Các bước tiếp theo để deploy backend trên VPS

Bạn đã có thư mục `backend` tại `/www/wwwroot/backend`. Bây giờ làm theo các bước sau:

## Bước 1: Vào thư mục backend

```bash
cd /www/wwwroot/backend
```

## Bước 2: Kiểm tra cấu trúc thư mục

```bash
ls -la
```

Đảm bảo có các file:
- `package.json`
- `src/`
- `tsconfig.json`

## Bước 3: Tạo file .env

```bash
nano .env
```

Thêm nội dung sau (thay đổi password nếu cần):

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Tuanvip19.
POSTGRES_DATABASE=newsbombs

# Server Configuration
PORT=3001
NODE_ENV=production

# JWT Secret (tạo một secret key ngẫu nhiên)
JWT_SECRET=your_super_secret_jwt_key_change_this_to_random_string

# Frontend URL (cho CORS)
FRONTEND_URL=https://newsbombs.pages.dev

# API URL
API_URL=http://157.66.100.32:3001
```

**Lưu ý:** Thay `your_super_secret_jwt_key_change_this_to_random_string` bằng một chuỗi ngẫu nhiên mạnh.

Lưu file: `Ctrl + O`, Enter, `Ctrl + X`

## Bước 4: Tạo JWT Secret ngẫu nhiên (nếu chưa có)

```bash
# Tạo JWT secret ngẫu nhiên
openssl rand -hex 32
```

Copy kết quả và thay vào `JWT_SECRET` trong file `.env`.

## Bước 5: Cài đặt Node.js (nếu chưa có)

```bash
# Kiểm tra Node.js
node --version

# Nếu chưa có, cài đặt:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## Bước 6: Cài đặt dependencies

```bash
cd /www/wwwroot/backend

# Cài đặt dependencies
npm install --production
```

## Bước 7: Build project

```bash
npm run build
```

## Bước 8: Tạo thư mục uploads và logs

```bash
mkdir -p uploads logs
chmod 755 uploads
```

## Bước 9: Chạy database seed (Tạo admin user)

```bash
npm run seed
```

Sau khi chạy seed, bạn sẽ có:
- Email: `admin@newsbombs.com`
- Password: `admin123`

**⚠️ QUAN TRỌNG:** Đổi password ngay sau khi deploy!

## Bước 10: Cài đặt PM2 (nếu chưa có)

```bash
# Kiểm tra PM2
pm2 --version

# Nếu chưa có, cài đặt:
sudo npm install -g pm2
```

## Bước 11: Tạo file ecosystem.config.js

```bash
nano ecosystem.config.js
```

Thêm nội dung:

```javascript
module.exports = {
  apps: [
    {
      name: "newsbombs-backend",
      script: "dist/main.js",
      cwd: "/www/wwwroot/backend",
      node_args: "--max-old-space-size=512",
      max_memory_restart: "500M",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      error_file: "/www/wwwroot/backend/logs/error.log",
      out_file: "/www/wwwroot/backend/logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
    },
  ],
};
```

Lưu file: `Ctrl + O`, Enter, `Ctrl + X`

## Bước 12: Khởi động backend với PM2

```bash
# Khởi động
pm2 start ecosystem.config.js

# Lưu PM2 process list
pm2 save

# Cấu hình PM2 tự động start khi reboot
pm2 startup
# Chạy lệnh mà PM2 hiển thị (thường là sudo env PATH=...)
```

## Bước 13: Mở port 3001 trong firewall

```bash
# Nếu dùng ufw
sudo ufw allow 3001/tcp

# Hoặc nếu dùng iptables
sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT
sudo iptables-save
```

## Bước 14: Kiểm tra backend

```bash
# Xem PM2 status
pm2 status

# Xem logs
pm2 logs newsbombs-backend

# Test API local
curl http://localhost:3001/api/articles

# Test API từ bên ngoài
curl http://157.66.100.32:3001/api/articles
```

## Bước 15: Cập nhật Cloudflare Pages

Sau khi backend chạy thành công, cập nhật Environment Variable trong Cloudflare Pages:

1. Vào **Cloudflare Dashboard** → **Workers & Pages** → **newsbombs**
2. **Settings** → **Environment Variables**
3. Thêm hoặc cập nhật:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `http://157.66.100.32:3001`
   - **Environment:** Production (và Preview nếu cần)
4. **Save** và **Redeploy**

## Các lệnh PM2 hữu ích

```bash
# Xem status
pm2 status

# Xem logs
pm2 logs newsbombs-backend

# Restart
pm2 restart newsbombs-backend

# Stop
pm2 stop newsbombs-backend

# Xem logs real-time
pm2 logs newsbombs-backend --lines 50
```

## Troubleshooting

### Backend không chạy

```bash
# Xem logs để tìm lỗi
pm2 logs newsbombs-backend --err

# Kiểm tra port
sudo netstat -tlnp | grep 3001
```

### Database connection error

```bash
# Kiểm tra PostgreSQL đang chạy
sudo systemctl status postgresql

# Test connection
sudo -u postgres psql -d newsbombs -c "SELECT 1;"
```

### Permission denied

```bash
# Đảm bảo có quyền truy cập
sudo chown -R $USER:$USER /www/wwwroot/backend
chmod -R 755 /www/wwwroot/backend
```

## Hoàn tất!

Sau khi hoàn tất, backend sẽ chạy tại: `http://157.66.100.32:3001`

