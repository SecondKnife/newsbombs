# Debug Login UI và API Route

## Vấn đề

Login vẫn trả về 500 Internal Server Error. UI đang gọi `/api/auth/login` (đúng), nhưng API route có thể đang lỗi.

## Đã sửa

1. ✅ UI đang gọi `/api/auth/login` - đúng (Next.js API route proxy)
2. ✅ Đã cải thiện error handling trong API route
3. ✅ Đã thêm logging chi tiết

## Cách debug

### Bước 1: Xem Response Body trong Browser

1. Mở **Developer Tools** (F12)
2. Vào tab **Network**
3. Click vào request `login` (status 500)
4. Vào tab **Response**
5. Copy toàn bộ nội dung response body

### Bước 2: Xem Logs trên Cloudflare Pages

1. Vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Workers & Pages** → **newsbombs**
3. **Deployments** → Click deployment mới nhất
4. Tìm **Logs** hoặc **Function Logs**
5. Tìm logs có:
   - `[LOGIN API] Request received`
   - `[LOGIN API] API_BASE_URL:`
   - `[LOGIN API] Forwarding login request to:`
   - `[getApiBaseUrl]`

### Bước 3: Test API Route trực tiếp

```bash
# Test endpoint đơn giản
curl https://nhatbinhkt.com/api/auth/login/test

# Test login endpoint
curl -X POST https://nhatbinhkt.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}' \
  -v
```

## Các khả năng

### 1. Edge Runtime không thể fetch đến HTTP URL
**Triệu chứng:** Logs có "fetch failed" hoặc "Invalid URL"
**Giải pháp:** 
- Đảm bảo `NEXT_PUBLIC_API_URL` = `https://api.nhatbinhkt.com` (HTTPS)
- Hoặc code sẽ dùng fallback `https://api.nhatbinhkt.com`

### 2. Environment Variable không được đọc
**Triệu chứng:** Logs có `[getApiBaseUrl] Using fallback`
**Giải pháp:**
- Kiểm tra Environment Variables trên Cloudflare Pages
- Đảm bảo `NEXT_PUBLIC_API_URL` = `https://api.nhatbinhkt.com`
- Redeploy sau khi thay đổi

### 3. Backend không accessible
**Triệu chứng:** Logs có "NetworkError" hoặc "503"
**Giải pháp:**
- Kiểm tra tunnel đang chạy: `sudo systemctl status cloudflared`
- Test tunnel endpoint: `curl https://api.nhatbinhkt.com/api/auth/login`

## Gửi thông tin cho tôi

Sau khi kiểm tra, hãy gửi:
1. **Response body** từ Network tab (toàn bộ nội dung)
2. **Logs** từ Cloudflare Dashboard (các dòng có `[LOGIN API]` hoặc `[getApiBaseUrl]`)
3. **Kết quả** từ test endpoint `/api/auth/login/test`

Với thông tin này, tôi có thể fix chính xác hơn.

