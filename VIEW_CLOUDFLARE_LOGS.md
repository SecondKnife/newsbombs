# Cách xem Logs trên Cloudflare Pages để tìm lỗi 500

## Vấn đề
Response vẫn là text "Internal Server Error" thay vì JSON, có nghĩa là có lỗi xảy ra trước khi code có thể chạy.

## Cách xem Logs trên Cloudflare Dashboard

### Bước 1: Vào Cloudflare Dashboard
1. Truy cập: https://dash.cloudflare.com
2. Đăng nhập vào tài khoản

### Bước 2: Vào Pages Project
1. Click **Workers & Pages** ở sidebar
2. Click vào project **newsbombs**

### Bước 3: Xem Function Logs
1. Vào tab **Deployments**
2. Click vào deployment mới nhất (có thể đang "Success")
3. Tìm và click **View function logs** hoặc **Logs** tab
4. Hoặc vào tab **Logs** (nếu có) ở trên cùng

### Bước 4: Test và xem Real-time Logs
1. Mở một tab khác với website: `https://nhatbinhkt.com/admin/login`
2. Thử login lại
3. Quay lại Cloudflare Dashboard → Logs
4. Xem logs real-time để tìm lỗi

### Bước 5: Tìm lỗi trong logs
Tìm các dòng có:
- `Error`
- `Failed`
- `Exception`
- `TypeError`
- `ReferenceError`
- `fetch failed`
- `Invalid URL`

## Test API Route đơn giản

Tôi đã tạo test endpoint tại `/api/auth/login/test`:
1. Mở: `https://nhatbinhkt.com/api/auth/login/test`
2. Nếu thấy JSON `{"message":"API route is working",...}` → API route hoạt động
3. Nếu vẫn lỗi 500 → Có vấn đề với Edge Runtime

## Nguyên nhân có thể

### 1. Edge Runtime không hỗ trợ fetch đến HTTP URLs
**Triệu chứng:** Lỗi "fetch failed" hoặc "Invalid URL" trong logs
**Giải pháp:** 
- Cần setup HTTPS cho backend
- Hoặc sử dụng Cloudflare Tunnel

### 2. Environment Variable không được đọc đúng
**Triệu chứng:** Backend URL là undefined hoặc localhost
**Giải pháp:**
- Kiểm tra `NEXT_PUBLIC_API_URL` trong Settings → Environment Variables
- Đảm bảo giá trị: `http://157.66.100.32:3001`

### 3. Lỗi trong quá trình import module
**Triệu chứng:** Lỗi "Cannot find module" hoặc "Unexpected token"
**Giải pháp:** 
- Kiểm tra build logs
- Đảm bảo không có syntax error

## Gửi logs cho tôi

Sau khi xem logs, hãy gửi cho tôi:
1. **Toàn bộ error message** từ logs
2. **Stack trace** (nếu có)
3. **Response từ test endpoint** `/api/auth/login/test`

Với thông tin này, tôi có thể fix chính xác hơn.

