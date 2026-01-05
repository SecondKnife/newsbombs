# Fix lỗi "password authentication failed for user postgres"

## Vấn đề

Lỗi khi chạy seed:
```
Error seeding database: error: password authentication failed for user "postgres"
```

## Nguyên nhân

Password trong file `.env` không đúng với password của user `postgres` trong PostgreSQL.

## Giải pháp

### Bước 1: Kiểm tra password hiện tại của postgres

```bash
# Test connection với password hiện tại
sudo -u postgres psql -c "SELECT 1;"
```

Nếu không cần password, có thể PostgreSQL đang dùng peer authentication.

### Bước 2: Set password cho postgres user

```bash
# Set password cho postgres user
sudo -u postgres psql << EOF
ALTER USER postgres PASSWORD 'Tuanvip19.';
\q
EOF
```

### Bước 3: Kiểm tra file .env

```bash
cd /www/wwwroot/backend

# Xem nội dung file .env
cat .env
```

Đảm bảo có:
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Tuanvip19.
POSTGRES_DATABASE=newsbombs
```

### Bước 4: Test connection với password

```bash
# Test connection từ command line
PGPASSWORD='Tuanvip19.' psql -h localhost -U postgres -d newsbombs -c "SELECT 1;"
```

Nếu lệnh này thành công, password đã đúng.

### Bước 5: Chạy lại seed

```bash
cd /www/wwwroot/backend
npm run seed
```

## Nếu vẫn lỗi - Cấu hình PostgreSQL authentication

Nếu vẫn lỗi, có thể cần cấu hình PostgreSQL để cho phép password authentication:

```bash
# Backup file config
sudo cp /etc/postgresql/*/main/pg_hba.conf /etc/postgresql/*/main/pg_hba.conf.backup

# Sửa file config
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Tìm dòng:
```
local   all             postgres                                peer
```

Đổi thành:
```
local   all             postgres                                md5
```

Hoặc thêm dòng:
```
host    all             all             127.0.0.1/32            md5
```

Sau đó restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

## Cách khác: Tạo user mới với password

Nếu không muốn dùng user postgres, tạo user mới:

```bash
sudo -u postgres psql << EOF
CREATE USER newsbombs_user WITH PASSWORD 'your_secure_password';
ALTER USER newsbombs_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE newsbombs TO newsbombs_user;
\q
EOF
```

Cập nhật file `.env`:
```env
POSTGRES_USER=newsbombs_user
POSTGRES_PASSWORD=your_secure_password
```

