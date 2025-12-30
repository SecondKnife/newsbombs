# Troubleshooting: Internal Server Error 500 trên Cloudflare Pages

## Vấn đề

Build thành công nhưng khi truy cập website vẫn bị lỗi **500 Internal Server Error**.

## Nguyên nhân phổ biến

### 1. Thiếu `nodejs_compat` Compatibility Flag (QUAN TRỌNG NHẤT!)

**Triệu chứng:** Lỗi 500 ngay khi truy cập trang chủ

**Giải pháp:**
1. Vào **Cloudflare Dashboard** → **Workers & Pages** → **newsbombs**
2. Vào **Settings** → **Runtime**
3. Tìm **Compatibility flags** → Click **Edit**
4. Thêm flag: `nodejs_compat`
5. **QUAN TRỌNG:** Thêm cho cả **Production và Preview**
6. Click **Save** và **Redeploy**

Xem chi tiết trong `CLOUDFLARE_NODEJS_COMPAT.md`

### 2. Thiếu Environment Variable `NEXT_PUBLIC_API_URL`

**Triệu chứng:** Lỗi 500 khi trang cố fetch từ API

**Giải pháp:**
1. Vào **Settings** → **Environment Variables**
2. Thêm biến:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** URL backend API của bạn (ví dụ: `http://157.66.100.32:3001`)
3. Click **Save** và **Redeploy**

**Lưu ý:** 
- Nếu không set biến này, ứng dụng sẽ cố kết nối đến `http://localhost:3001` và sẽ fail
- URL phải là public URL (không thể là `localhost`)

### 3. Backend API không accessible

**Triệu chứng:** Lỗi 500 khi fetch articles

**Giải pháp:**
- Đảm bảo backend API đang chạy và accessible từ internet
- Kiểm tra firewall/network settings
- Kiểm tra CORS settings trên backend

### 4. Lỗi trong Edge Runtime

**Triệu chứng:** Lỗi 500 do sử dụng Node.js APIs không được hỗ trợ

**Giải pháp:**
- Đảm bảo `nodejs_compat` flag đã được thêm
- Kiểm tra logs trong Cloudflare Dashboard để xem lỗi cụ thể

## Cách kiểm tra logs

1. Vào **Cloudflare Dashboard** → **Workers & Pages** → **newsbombs**
2. Vào **Deployments** → chọn deployment mới nhất
3. Click **View build logs** hoặc **View function logs**
4. Tìm các dòng có chứa "Error" hoặc "Failed"

## Checklist

- [ ] `nodejs_compat` flag đã được thêm trong **Settings** → **Runtime** → **Compatibility flags**
- [ ] Flag đã được thêm cho cả **Production và Preview**
- [ ] `NEXT_PUBLIC_API_URL` đã được set trong **Environment Variables** (nếu cần backend API)
- [ ] Backend API đang chạy và accessible (nếu cần)
- [ ] Đã **Redeploy** sau khi thay đổi settings
- [ ] Đã kiểm tra logs để xem lỗi cụ thể

## Bước tiếp theo

Nếu vẫn gặp lỗi sau khi làm theo checklist:

1. **Kiểm tra logs:** Xem logs trong Cloudflare Dashboard để biết lỗi cụ thể
2. **Kiểm tra Console:** Mở Developer Tools → Console để xem lỗi client-side
3. **Kiểm tra Network:** Xem Network tab để xem request nào bị fail

## Liên hệ

Nếu vẫn không giải quyết được, hãy cung cấp:
- Logs từ Cloudflare Dashboard
- Screenshot của lỗi
- Thông tin về backend API (nếu có)

