# Kiểm tra Logs Runtime trên Cloudflare

## Vấn đề

Tất cả API endpoints (GET và POST) đều trả về "Internal Server Error" sau khi deploy.

## Cần kiểm tra

### Bước 1: Xem Runtime Logs trên Cloudflare Dashboard

1. Vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Workers & Pages** → **newsbombs**
3. **Deployments** → Click vào deployment mới nhất
4. Tìm tab **Logs** hoặc **Real-time Logs**
5. Test lại endpoint trong terminal khác để trigger logs

### Bước 2: Kiểm tra Compatibility Flags

1. Vào **Settings** → Scroll xuống **Runtime**
2. Kiểm tra **Compatibility flags**:
   - Phải có `nodejs_compat` flag
   - Nếu không có, thêm flag này

### Bước 3: Test và xem logs

Sau khi test endpoint, xem logs để tìm:
- Error messages cụ thể
- Stack traces
- Runtime errors

## Các khả năng

### 1. Thiếu `nodejs_compat` flag
- Edge Runtime cần flag này để hoạt động
- Giải pháp: Thêm flag trong Cloudflare Dashboard

### 2. Lỗi trong Edge Runtime code
- Có thể có code không tương thích với Edge Runtime
- Giải pháp: Xem logs để biết lỗi cụ thể

### 3. Environment variables không được set
- `NEXT_PUBLIC_API_URL` có thể không được set
- Giải pháp: Kiểm tra Environment Variables trong Settings

## Gửi cho tôi

Sau khi kiểm tra, hãy gửi:
1. **Logs** từ Cloudflare Dashboard (copy/paste)
2. **Compatibility flags** hiện tại (có `nodejs_compat` không?)
3. **Environment variables** đã được set (có `NEXT_PUBLIC_API_URL` không?)

Với thông tin này, tôi sẽ fix chính xác hơn.

