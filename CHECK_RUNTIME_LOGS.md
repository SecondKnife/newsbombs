# Cách kiểm tra Runtime Logs để tìm lỗi 500

## Vấn đề

Bạn đã setup `nodejs_compat` flag và `NEXT_PUBLIC_API_URL` nhưng vẫn bị lỗi 500. Cần xem logs để biết lỗi cụ thể.

## Cách xem Runtime Logs trong Cloudflare Dashboard

### Bước 1: Vào Cloudflare Dashboard

1. Truy cập: https://dash.cloudflare.com
2. Vào **Workers & Pages** → chọn project **newsbombs**

### Bước 2: Xem Function Logs

1. Vào tab **Deployments**
2. Chọn deployment mới nhất (có thể đang ở trạng thái "Success")
3. Click vào deployment đó để xem chi tiết
4. Tìm và click **View function logs** hoặc **Logs** tab

### Bước 3: Xem Real-time Logs

1. Vào tab **Metrics** (nếu có)
2. Hoặc vào **Workers & Pages** → **newsbombs** → **Logs** (nếu có)
3. Xem các logs real-time khi có request đến

### Bước 4: Tìm lỗi

Trong logs, tìm các dòng có:
- `Error`
- `Failed`
- `Exception`
- `500`
- `Internal Server Error`

## Cách xem logs từ Browser Console

1. Mở website bị lỗi
2. Mở Developer Tools (F12)
3. Vào tab **Console**
4. Xem các lỗi JavaScript
5. Vào tab **Network**
6. Click vào request bị lỗi (có status 500)
7. Xem **Response** tab để xem error message

## Các lỗi phổ biến và cách sửa

### Lỗi: "fetch failed" hoặc "NetworkError"
**Nguyên nhân:** Backend API không accessible hoặc URL sai
**Giải pháp:** 
- Kiểm tra `NEXT_PUBLIC_API_URL` có đúng không
- Kiểm tra backend API có đang chạy không
- Kiểm tra CORS settings trên backend

### Lỗi: "Cannot read property of undefined"
**Nguyên nhân:** Code đang cố truy cập property của object undefined
**Giải pháp:** Đã được fix trong code mới nhất

### Lỗi: "setTimeout is not defined"
**Nguyên nhân:** `nodejs_compat` flag chưa được apply đúng
**Giải pháp:** 
- Đảm bảo flag đã được thêm và saved
- Redeploy lại

### Lỗi: "Invalid URL" hoặc "URL must be absolute"
**Nguyên nhân:** API URL không hợp lệ
**Giải pháp:** Đã được fix trong code mới nhất - kiểm tra URL trước khi fetch

## Gửi logs cho tôi

Nếu vẫn không tìm được nguyên nhân, hãy:
1. Copy toàn bộ logs từ Cloudflare Dashboard
2. Copy error message từ Browser Console
3. Gửi cho tôi để phân tích

