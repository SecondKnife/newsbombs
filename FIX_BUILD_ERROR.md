# Fix lỗi "nest: command not found"

## Vấn đề

Khi chạy `npm run build` bị lỗi:
```
sh: line 1: nest: command not found
```

## Nguyên nhân

Lỗi này xảy ra vì:
1. Chạy `npm install --production` nên không cài devDependencies
2. `@nestjs/cli` nằm trong devDependencies, cần để build

## Giải pháp

### Cách 1: Cài đặt đầy đủ dependencies (Khuyến nghị)

```bash
cd /www/wwwroot/backend

# Cài đặt TẤT CẢ dependencies (bao gồm devDependencies)
npm install

# Build project
npm run build

# Sau khi build xong, có thể xóa devDependencies nếu muốn tiết kiệm dung lượng
# (Nhưng không bắt buộc)
```

### Cách 2: Cài đặt @nestjs/cli global

```bash
# Cài đặt NestJS CLI global
sudo npm install -g @nestjs/cli

# Build
npm run build
```

### Cách 3: Build từ local rồi upload dist

Nếu VPS có ít dung lượng, có thể build trên máy local rồi upload thư mục `dist`:

**Trên máy local:**
```bash
cd backend
npm install
npm run build
```

**Upload dist lên VPS:**
```bash
scp -r backend/dist root@157.66.100.32:/www/wwwroot/backend/
```

## Sau khi build thành công

Sau khi build xong, bạn sẽ có thư mục `dist/` chứa code đã compile.

Tiếp tục các bước:
1. Tạo thư mục uploads và logs
2. Chạy seed
3. Khởi động với PM2

