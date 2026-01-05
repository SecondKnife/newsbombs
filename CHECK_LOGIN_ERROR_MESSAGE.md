# Cách kiểm tra Error Message chi tiết từ Login API

## Vấn đề
Login API trả về lỗi 500, nhưng cần xem error message cụ thể để biết nguyên nhân.

## Cách kiểm tra Error Message

### Bước 1: Mở Developer Tools
1. Mở website: `https://nhatbinhkt.com/admin/login`
2. Nhấn **F12** để mở Developer Tools
3. Vào tab **Network**

### Bước 2: Thử Login
1. Nhập email: `admin@newsbombs.com`
2. Nhập password: `admin123`
3. Click **Login**

### Bước 3: Xem Error Message
1. Trong tab **Network**, tìm request có tên `login` (màu đỏ)
2. Click vào request `login`
3. Vào tab **Response** hoặc **Preview**
4. Xem error message chi tiết

## Các Error Message có thể gặp

### 1. "Invalid backend URL: ..."
**Nguyên nhân:** Environment variable `NEXT_PUBLIC_API_URL` không đúng hoặc không được set
**Giải pháp:**
- Vào Cloudflare Pages → Settings → Environment Variables
- Đảm bảo có `NEXT_PUBLIC_API_URL` = `http://157.66.100.32:3001`
- Redeploy lại

### 2. "Cannot connect to backend at ..."
**Nguyên nhân:** Backend API không accessible từ Cloudflare
**Giải pháp:**
- Kiểm tra backend có đang chạy không: `http://157.66.100.32:3001/api/auth/login`
- Kiểm tra firewall trên VPS
- Kiểm tra backend có listen trên 0.0.0.0 không (không phải localhost)

### 3. "Failed to connect to backend: ..."
**Nguyên nhân:** Network error khi fetch đến backend
**Giải pháp:**
- Có thể Cloudflare Edge Runtime không hỗ trợ fetch đến HTTP URLs
- Cần setup HTTPS cho backend hoặc dùng Cloudflare Tunnel

### 4. "Invalid request body"
**Nguyên nhân:** Request body không đúng format
**Giải pháp:** Đã được fix trong code mới nhất

## Gửi Error Message cho tôi

Sau khi kiểm tra, hãy gửi cho tôi:
1. **Error message** từ tab Response
2. **Status code** (thường là 500)
3. **Backend URL** được sử dụng (nếu có trong error message)

Với thông tin này, tôi có thể fix chính xác hơn.

## Test Backend trực tiếp

Để đảm bảo backend hoạt động, test trực tiếp:

```bash
curl -X POST http://157.66.100.32:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}'
```

Nếu backend trả về token, backend hoạt động tốt. Vấn đề nằm ở Cloudflare Pages Edge Runtime.

