# Fix 500 Internal Server Error trên Cloudflare Pages

## Vấn đề
Build thành công 100% nhưng khi truy cập trang web vẫn bị lỗi 500 Internal Server Error.

## Nguyên nhân có thể

1. **Thiếu `nodejs_compat` compatibility flag** - Cần thiết cho `setTimeout` và một số Node.js APIs
2. **Environment variables chưa được set** - `NEXT_PUBLIC_API_URL` không được cấu hình
3. **Lỗi trong edge runtime** - Một số code không tương thích với Cloudflare Edge Runtime

## Giải pháp

### Bước 1: Thêm `nodejs_compat` Compatibility Flag (BẮT BUỘC)

1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vào **Workers & Pages** → Chọn project **newsbombs**
3. Vào tab **Settings** → Scroll xuống **Compatibility Flags**
4. Thêm flag: `nodejs_compat`
5. Click **Save**

**Lưu ý:** File `wrangler.toml` KHÔNG ĐỦ! Bạn PHẢI thêm flag trực tiếp trong Dashboard.

### Bước 2: Cấu hình Environment Variables

1. Vào **Workers & Pages** → **newsbombs** → **Settings**
2. Scroll xuống **Environment Variables**
3. Thêm biến:
   - **Variable name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `http://157.66.100.32:3001` (hoặc URL backend của bạn)
   - **Environment:** Production (và Preview nếu cần)
4. Click **Save**

### Bước 3: Kiểm tra Runtime Logs

1. Vào **Workers & Pages** → **newsbombs** → **Deployments**
2. Click vào deployment mới nhất
3. Vào tab **Logs** hoặc **Real-time Logs**
4. Xem lỗi cụ thể trong logs

### Bước 4: Redeploy

Sau khi thêm compatibility flag và environment variables:

1. Vào **Deployments** tab
2. Click **Retry deployment** hoặc push code mới lên GitHub
3. Đợi build hoàn tất
4. Kiểm tra lại trang web

## Kiểm tra nhanh

Sau khi deploy, kiểm tra:

1. **Trang chủ:** `https://newsbombs.pages.dev/`
2. **API endpoint:** `https://newsbombs.pages.dev/api/tags`
3. **Xem logs:** Cloudflare Dashboard → Real-time Logs

## Troubleshooting

### Nếu vẫn bị 500 error:

1. **Kiểm tra logs:**
   - Vào Cloudflare Dashboard → Real-time Logs
   - Tìm lỗi cụ thể trong logs

2. **Kiểm tra environment variables:**
   - Đảm bảo `NEXT_PUBLIC_API_URL` đã được set
   - Kiểm tra giá trị có đúng không

3. **Kiểm tra backend API:**
   - Đảm bảo backend đang chạy: `http://157.66.100.32:3001`
   - Kiểm tra CORS settings cho phép requests từ `newsbombs.pages.dev`

4. **Kiểm tra compatibility flag:**
   - Đảm bảo `nodejs_compat` đã được thêm trong Dashboard
   - Không chỉ trong `wrangler.toml`

### Lỗi thường gặp:

- **`setTimeout is not defined`** → Cần thêm `nodejs_compat` flag
- **`process.env is undefined`** → Environment variables chưa được set
- **`Failed to fetch`** → Backend API không accessible hoặc CORS issue

## Code đã được cải thiện

Các file sau đã được cải thiện để xử lý edge runtime tốt hơn:

- `lib/api/articles.ts` - Cải thiện error handling và timeout
- `app/page.tsx` - Thêm try-catch bổ sung
- `app/api/tags/route.ts` - Cải thiện environment variable reading

## Liên hệ

Nếu vẫn gặp vấn đề, cung cấp:
1. Logs từ Cloudflare Dashboard
2. Screenshot của Compatibility Flags settings
3. Screenshot của Environment Variables settings

