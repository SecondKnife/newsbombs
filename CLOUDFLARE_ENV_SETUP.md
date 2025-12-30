# Cấu hình Environment Variables cho Cloudflare Pages

## Vấn đề

Ứng dụng Next.js cần kết nối đến backend API. Trên Cloudflare Pages, bạn cần cấu hình environment variable `NEXT_PUBLIC_API_URL` để trỏ đến backend API của bạn.

## Cách cấu hình

### Bước 1: Vào Cloudflare Dashboard

1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vào **Workers & Pages** → chọn project `newsbombs`
3. Vào **Settings** → **Environment Variables**

### Bước 2: Thêm Environment Variables

Thêm các biến sau:

#### Production Environment:
- **Variable name:** `NEXT_PUBLIC_API_URL`
- **Value:** URL của backend API của bạn (ví dụ: `https://your-backend-api.com` hoặc `http://157.66.100.32:3001`)

#### Preview Environment (optional):
- Có thể set giá trị khác cho preview deployments

### Bước 3: Lưu và Redeploy

1. Click **Save**
2. Vào **Deployments** → chọn deployment mới nhất → **Retry deployment** hoặc **Redeploy**

## Lưu ý

- `NEXT_PUBLIC_API_URL` phải là public URL (không thể là `localhost` hoặc `127.0.0.1`)
- Nếu backend API của bạn không có HTTPS, bạn có thể cần cấu hình CORS trên backend
- Nếu không set `NEXT_PUBLIC_API_URL`, ứng dụng sẽ cố kết nối đến `http://localhost:3001` và sẽ fail

## Troubleshooting

### Lỗi "Internal Server Error"
- Kiểm tra xem `NEXT_PUBLIC_API_URL` đã được set chưa
- Kiểm tra xem backend API có đang chạy và accessible không
- Kiểm tra logs trong Cloudflare Dashboard → Deployments → View build logs

### Lỗi CORS
- Đảm bảo backend API cho phép requests từ domain Cloudflare Pages của bạn
- Thêm domain vào CORS whitelist trên backend

### Lỗi timeout
- Kiểm tra xem backend API có đang chạy không
- Kiểm tra firewall/network settings

