# Hướng dẫn SỬA LỖI 500 - Từng bước chi tiết

## ⚠️ VẤN ĐỀ

Build thành công nhưng website vẫn bị **lỗi 500 Internal Server Error**.

## ✅ GIẢI PHÁP: Thêm `nodejs_compat` Flag

**Đây là bước QUAN TRỌNG NHẤT và BẮT BUỘC!**

### Bước 1: Mở Cloudflare Dashboard

1. Truy cập: https://dash.cloudflare.com
2. Đăng nhập vào tài khoản của bạn

### Bước 2: Vào Pages Project

1. Click vào **Workers & Pages** ở sidebar bên trái
2. Tìm và click vào project **newsbombs**

### Bước 3: Vào Settings → Runtime

1. Click tab **Settings** ở trên cùng
2. Cuộn xuống tìm phần **Runtime** (không phải "Builds & deployments")
3. Bạn sẽ thấy các mục:
   - Placement: Default
   - Compatibility date: Jan 1, 2024
   - **Compatibility flags: No flags defined** ← Đây là vấn đề!

### Bước 4: Thêm `nodejs_compat` Flag

1. Tìm mục **Compatibility flags** (hiện đang là "No flags defined")
2. Click vào icon **Edit** (biểu tượng bút chì) bên cạnh
3. Trong popup/modal hiện ra:
   - Click nút **Add flag** hoặc **+ Add** hoặc **Add compatibility flag**
   - Trong dropdown hoặc input field, chọn/nhập: **`nodejs_compat`**
   - (Nếu có dropdown, chọn từ danh sách)
4. Click **Save** hoặc **Apply**

### Bước 5: Thêm cho Preview Environment (QUAN TRỌNG!)

1. Sau khi thêm cho Production, kiểm tra xem có tab **Preview** không
2. Nếu có tab **Preview**:
   - Click vào tab **Preview**
   - Lặp lại Bước 4: Thêm flag `nodejs_compat` cho Preview
   - Click **Save**

### Bước 6: Lưu và Redeploy

1. Đảm bảo bạn đã click **Save** ở tất cả các tab (Production và Preview)
2. Vào tab **Deployments**
3. Tìm deployment mới nhất (có thể đang ở trạng thái "Success" nhưng vẫn lỗi 500)
4. Click vào deployment đó
5. Click nút **Retry deployment** hoặc **Redeploy**

### Bước 7: Kiểm tra

1. Đợi deployment hoàn tất (thường mất 1-2 phút)
2. Truy cập lại website của bạn
3. Website sẽ hoạt động bình thường!

## ✅ Kiểm tra Flag đã được thêm chưa

Sau khi thêm flag, trong phần **Runtime** bạn sẽ thấy:
- **Compatibility flags:** `nodejs_compat` (thay vì "No flags defined")

## 🔍 Nếu vẫn không thấy mục "Compatibility flags"

1. Đảm bảo bạn đang ở đúng project **newsbombs**
2. Đảm bảo bạn đang ở tab **Settings** → **Runtime** (không phải "Builds & deployments")
3. Thử refresh trang Dashboard (F5)
4. Nếu vẫn không thấy, có thể cần:
   - Upgrade Cloudflare plan (một số tính năng chỉ có ở plan cao hơn)
   - Hoặc liên hệ Cloudflare support

## 📝 Checklist

Trước khi redeploy, đảm bảo:

- [ ] Đã thêm flag `nodejs_compat` trong **Settings** → **Runtime** → **Compatibility flags**
- [ ] Đã thêm flag cho **Production** environment
- [ ] Đã thêm flag cho **Preview** environment (nếu có)
- [ ] Đã click **Save** sau khi thêm flag
- [ ] Đã **Redeploy** sau khi thêm flag
- [ ] Đã kiểm tra trong **Runtime** và thấy `nodejs_compat` (không còn "No flags defined")

## ⚠️ Lưu ý quan trọng

1. **File `wrangler.toml` KHÔNG ĐỦ!** Bạn PHẢI thêm flag trực tiếp trong Cloudflare Dashboard
2. **Flag phải được thêm cho CẢ Production và Preview** (nếu có)
3. **Phải Redeploy** sau khi thêm flag, không chỉ Save
4. **Flag này là BẮT BUỘC** cho Next.js apps sử dụng `@cloudflare/next-on-pages`

## 🆘 Nếu vẫn lỗi sau khi làm theo hướng dẫn

1. Kiểm tra logs:
   - Vào **Deployments** → chọn deployment mới nhất
   - Click **View build logs** hoặc **View function logs**
   - Tìm các dòng có "Error" hoặc "Failed"
   - Copy và gửi cho tôi

2. Kiểm tra Environment Variables:
   - Vào **Settings** → **Environment Variables**
   - Đảm bảo `NEXT_PUBLIC_API_URL` đã được set (nếu cần backend API)

3. Kiểm tra Console trong browser:
   - Mở Developer Tools (F12)
   - Xem tab **Console** và **Network**
   - Tìm các lỗi cụ thể

