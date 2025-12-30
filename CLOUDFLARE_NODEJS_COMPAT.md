# Cách thêm nodejs_compat Compatibility Flag trên Cloudflare Pages

## Vấn đề

Bạn đang gặp lỗi: **"Node.JS Compatibility Error - no nodejs_compat compatibility flag set"**

Lỗi này xảy ra vì Cloudflare Pages không tự động đọc `compatibility_flags` từ file `wrangler.toml`. Bạn cần thêm flag trực tiếp trong Cloudflare Dashboard.

## Giải pháp: Thêm nodejs_compat Flag trong Cloudflare Dashboard

### Bước 1: Vào Cloudflare Dashboard

1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vào **Workers & Pages** → chọn project **newsbombs**
3. Vào **Settings** → cuộn xuống phần **Runtime**

### Bước 2: Thêm Compatibility Flag

1. Trong phần **Runtime**, tìm mục **Compatibility flags**
2. Click vào icon **Edit** (biểu tượng bút chì) bên cạnh "No flags defined"
3. Trong popup/modal hiện ra:
   - Click **Add flag** hoặc **+ Add**
   - Chọn hoặc nhập: `nodejs_compat`
   - Click **Save** hoặc **Apply**

### Bước 3: Áp dụng cho cả Production và Preview

**QUAN TRỌNG:** Bạn cần thêm flag cho **CẢ HAI** environments:

1. **Production environment:**
   - Đảm bảo flag `nodejs_compat` được thêm cho Production
   
2. **Preview environment:**
   - Click vào tab **Preview** (nếu có)
   - Thêm flag `nodejs_compat` cho Preview environment

### Bước 4: Lưu và Redeploy

1. Click **Save** để lưu cấu hình
2. Vào **Deployments** → chọn deployment mới nhất
3. Click **Retry deployment** hoặc **Redeploy** để deploy lại với flag mới

## Kiểm tra sau khi thêm flag

Sau khi thêm flag và redeploy, bạn sẽ thấy trong phần **Runtime**:
- **Compatibility flags:** `nodejs_compat` (thay vì "No flags defined")

## Lưu ý

- Flag `nodejs_compat` là **BẮT BUỘC** cho Next.js apps sử dụng `@cloudflare/next-on-pages`
- Flag này cho phép sử dụng Node.js APIs trong Edge Runtime
- Nếu không có flag này, bạn sẽ gặp lỗi khi truy cập website

## Troubleshooting

### Vẫn thấy "No flags defined"
- Đảm bảo bạn đã click **Save** sau khi thêm flag
- Thử refresh trang Dashboard
- Kiểm tra xem bạn đang ở đúng project `newsbombs`

### Flag không áp dụng
- Đảm bảo bạn đã redeploy sau khi thêm flag
- Kiểm tra xem flag đã được thêm cho cả Production và Preview chưa
- Xóa cache browser và thử lại

### Không tìm thấy mục Compatibility flags
- Đảm bảo bạn đang ở **Settings** → **Runtime** (không phải Builds & deployments)
- Nếu vẫn không thấy, có thể cần upgrade Cloudflare plan hoặc liên hệ support

