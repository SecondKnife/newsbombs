# Debug Login 500 Error

## Vấn đề
Khi click vào nút login, gặp lỗi 500 Internal Server Error.

## Đã sửa
1. ✅ Tạo Next.js API route proxy tại `/api/auth/login` để tránh mixed-content error
2. ✅ Cải thiện error handling và logging
3. ✅ Cải thiện cách đọc environment variables trong Edge Runtime

## Cách kiểm tra logs trên Cloudflare Pages

### Bước 1: Kiểm tra Logs trên Cloudflare Dashboard

1. Vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Chọn **Workers & Pages** → project `newsbombs`
3. Click vào tab **Logs** hoặc **Real-time Logs**
4. Thử login lại và xem logs để tìm lỗi cụ thể

### Bước 2: Kiểm tra Environment Variables

1. Vào **Workers & Pages** → project `newsbombs`
2. Click vào **Settings** → **Environment Variables**
3. Đảm bảo có biến `NEXT_PUBLIC_API_URL` với giá trị: `http://157.66.100.32:3001`

### Bước 3: Test Backend API trực tiếp

Backend API đã được test và hoạt động tốt:
- URL: `http://157.66.100.32:3001/api/auth/login`
- Method: POST
- Body: `{ "email": "admin@newsbombs.com", "password": "admin123" }`

### Bước 4: Kiểm tra Network Tab trong Browser

1. Mở DevTools (F12)
2. Vào tab **Network**
3. Thử login lại
4. Click vào request `login`
5. Xem **Response** tab để xem error message cụ thể

## Các nguyên nhân có thể

1. **Edge Runtime không hỗ trợ fetch đến HTTP URLs**
   - Cloudflare Pages Edge Runtime có thể chặn fetch đến HTTP URLs
   - Giải pháp: Cần cấu hình backend để hỗ trợ HTTPS hoặc sử dụng Cloudflare Tunnel

2. **Environment Variable không được set đúng**
   - Kiểm tra `NEXT_PUBLIC_API_URL` trong Cloudflare Pages settings
   - Đảm bảo giá trị đúng: `http://157.66.100.32:3001`

3. **Backend API không accessible từ Cloudflare**
   - Backend có thể bị firewall chặn
   - Cần mở port 3001 trên VPS

## Giải pháp đề xuất

### Option 1: Sử dụng HTTPS cho Backend (Khuyến nghị)
1. Cài đặt SSL certificate cho backend (Let's Encrypt)
2. Cập nhật `NEXT_PUBLIC_API_URL` thành `https://your-backend-domain.com`

### Option 2: Sử dụng Cloudflare Tunnel
1. Cài đặt `cloudflared` trên VPS
2. Tạo tunnel từ VPS đến Cloudflare
3. Sử dụng tunnel URL trong `NEXT_PUBLIC_API_URL`

### Option 3: Kiểm tra logs và fix theo lỗi cụ thể
1. Xem logs trên Cloudflare Pages
2. Tìm error message cụ thể
3. Fix theo error message

## Test lại sau khi deploy

Sau khi Cloudflare Pages deploy xong:
1. Vào `https://nhatbinhkt.com/admin/login`
2. Nhập credentials:
   - Email: `admin@newsbombs.com`
   - Password: `admin123`
3. Click Login
4. Kiểm tra Network tab nếu vẫn lỗi

