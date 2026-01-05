# Hướng dẫn Deploy Backend NestJS lên VPS

## Yêu cầu

- VPS với IP: `157.66.100.32`
- Ubuntu/Debian Linux
- Quyền root hoặc sudo
- SSH access

## Bước 1: Chuẩn bị VPS

### 1.1. SSH vào VPS

```bash
ssh root@157.66.100.32
# hoặc
ssh your_username@157.66.100.32
```

### 1.2. Cập nhật hệ thống

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.3. Cài đặt Node.js (nếu chưa có)

```bash
# Cài đặt Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra version
node --version
npm --version
```

### 1.4. Cài đặt PostgreSQL (nếu chưa có)

```bash
# Cài đặt PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Khởi động PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Tạo database và user
sudo -u postgres psql << EOF
CREATE DATABASE newsbombs;
CREATE USER newsbombs_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE newsbombs TO newsbombs_user;
\q
EOF

# Hoặc nếu muốn dùng user postgres
sudo -u postgres psql << EOF
ALTER USER postgres PASSWORD 'Tuanvip19.';
\q
EOF
```

### 1.5. Cài đặt PM2

```bash
sudo npm install -g pm2
```

## Bước 2: Upload code lên VPS

### Cách 1: Clone từ GitHub (Khuyến nghị)

```bash
# Tạo thư mục project
sudo mkdir -p /www/wwwroot/newsbombs-backend
sudo chown -R $USER:$USER /www/wwwroot/newsbombs-backend

# Clone repository
cd /www/wwwroot/newsbombs-backend
git clone https://github.com/SecondKnife/newsbombs.git .

# Vào thư mục backend
cd backend
```

### Cách 2: Upload qua SCP

```bash
# Từ máy local
scp -r backend root@157.66.100.32:/www/wwwroot/newsbombs-backend/
```

## Bước 3: Cấu hình Environment Variables

```bash
cd /www/wwwroot/newsbombs-backend/backend

# Tạo file .env
nano .env
```

Thêm nội dung sau vào file `.env`:

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
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Frontend URL (cho CORS)
FRONTEND_URL=https://newsbombs.pages.dev

# API URL
API_URL=http://157.66.100.32:3001
```

**Lưu ý:** Thay `your_super_secret_jwt_key_here_change_this` bằng một secret key ngẫu nhiên mạnh.

## Bước 4: Cài đặt Dependencies và Build

```bash
cd /www/wwwroot/newsbombs-backend/backend

# Cài đặt dependencies
npm install --production

# Build project
npm run build
```

## Bước 5: Tạo thư mục uploads

```bash
mkdir -p /www/wwwroot/newsbombs-backend/backend/uploads
chmod 755 /www/wwwroot/newsbombs-backend/backend/uploads
```

## Bước 6: Chạy Database Seed (Tạo admin user)

```bash
cd /www/wwwroot/newsbombs-backend/backend

# Chạy seed script
npm run seed
```

Sau khi chạy seed, bạn sẽ có:
- Email: `admin@newsbombs.com`
- Password: `admin123`

**⚠️ QUAN TRỌNG:** Đổi password ngay sau khi deploy!

## Bước 7: Cấu hình PM2

Tạo file `ecosystem.config.js` trong thư mục backend:

```bash
cd /www/wwwroot/newsbombs-backend/backend
nano ecosystem.config.js
```

Thêm nội dung:

```javascript
module.exports = {
  apps: [
    {
      name: "newsbombs-backend",
      script: "dist/main.js",
      cwd: "/www/wwwroot/newsbombs-backend/backend",
      node_args: "--max-old-space-size=512",
      max_memory_restart: "500M",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      error_file: "/www/wwwroot/newsbombs-backend/backend/logs/error.log",
      out_file: "/www/wwwroot/newsbombs-backend/backend/logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
    },
  ],
};
```

Tạo thư mục logs:

```bash
mkdir -p /www/wwwroot/newsbombs-backend/backend/logs
```

## Bước 8: Khởi động Backend với PM2

```bash
cd /www/wwwroot/newsbombs-backend/backend

# Khởi động với PM2
pm2 start ecosystem.config.js

# Lưu PM2 process list để tự động restart khi reboot
pm2 save
pm2 startup
```

## Bước 9: Cấu hình Firewall

```bash
# Mở port 3001
sudo ufw allow 3001/tcp

# Hoặc nếu dùng iptables
sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT
sudo iptables-save
```

## Bước 10: Kiểm tra Backend

```bash
# Kiểm tra PM2 status
pm2 status

# Xem logs
pm2 logs newsbombs-backend

# Test API
curl http://localhost:3001/api/articles
curl http://157.66.100.32:3001/api/articles
```

## Bước 11: Cấu hình Nginx (Tùy chọn - nếu muốn dùng domain)

Nếu bạn muốn dùng domain thay vì IP, cấu hình Nginx reverse proxy:

```bash
sudo nano /etc/nginx/sites-available/newsbombs-api
```

Thêm nội dung:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Thay bằng domain của bạn

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Kích hoạt:

```bash
sudo ln -s /etc/nginx/sites-available/newsbombs-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

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

# Xóa process
pm2 delete newsbombs-backend

# Monitor
pm2 monit
```

## Troubleshooting

### Backend không chạy

1. Kiểm tra logs:
```bash
pm2 logs newsbombs-backend
```

2. Kiểm tra port đã được mở:
```bash
sudo netstat -tlnp | grep 3001
```

3. Kiểm tra database connection:
```bash
cd /www/wwwroot/newsbombs-backend/backend
npm run seed
```

### Database connection error

1. Kiểm tra PostgreSQL đang chạy:
```bash
sudo systemctl status postgresql
```

2. Kiểm tra database và user:
```bash
sudo -u postgres psql -c "\l"
sudo -u postgres psql -c "\du"
```

3. Test connection:
```bash
sudo -u postgres psql -d newsbombs -c "SELECT 1;"
```

### CORS error

Đảm bảo `FRONTEND_URL` trong `.env` đúng:
```env
FRONTEND_URL=https://newsbombs.pages.dev
```

## Cập nhật Backend

```bash
cd /www/wwwroot/newsbombs-backend/backend

# Pull code mới
git pull origin main

# Cài đặt dependencies mới (nếu có)
npm install --production

# Build lại
npm run build

# Restart PM2
pm2 restart newsbombs-backend
```

## Bảo mật

1. **Đổi password admin ngay sau khi deploy**
2. **Đổi JWT_SECRET thành một giá trị ngẫu nhiên mạnh**
3. **Cấu hình firewall chỉ cho phép IP cần thiết**
4. **Sử dụng SSL/HTTPS nếu có domain**

## Hoàn tất!

Sau khi hoàn tất, backend sẽ chạy tại: `http://157.66.100.32:3001`

Cập nhật `NEXT_PUBLIC_API_URL` trong Cloudflare Pages thành: `http://157.66.100.32:3001`

