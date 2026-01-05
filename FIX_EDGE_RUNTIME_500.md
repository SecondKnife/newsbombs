# Fix Edge Runtime 500 Error trên Cloudflare Pages

## Vấn đề

Tất cả API endpoints (kể cả `/api/debug` đơn giản nhất) đều trả về:
- Status: 500 Internal Server Error
- Content-Type: text/plain;charset=UTF-8
- Response: "Internal Server Error" (plain text, không phải JSON)

Điều này cho thấy lỗi xảy ra ở **Edge Runtime level**, không phải từ code.

## Nguyên nhân có thể

### 1. Thiếu `nodejs_compat` Compatibility Flag trong Dashboard

**QUAN TRỌNG:** File `wrangler.toml` có flag nhưng Cloudflare Pages có thể không đọc được. Bạn PHẢI thêm flag trực tiếp trong Dashboard.

### 2. Edge Runtime không được enable đúng cách

## Giải pháp

### Bước 1: Kiểm tra và thêm Compatibility Flag trong Dashboard

1. Vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Workers & Pages** → **newsbombs**
3. **Settings** → Scroll xuống **Runtime**
4. Tìm **Compatibility flags**
5. Nếu thấy "No flags defined":
   - Click icon **Edit** (bút chì) bên cạnh
   - Click **Add flag** hoặc **+ Add**
   - Chọn/nhập: `nodejs_compat`
   - Click **Save**
6. **QUAN TRỌNG:** Thêm cho cả **Production** và **Preview** environments

### Bước 2: Xem Logs qua Wrangler CLI

Nếu không thấy logs trong Dashboard, dùng Wrangler CLI:

```bash
# Install Wrangler (nếu chưa có)
npm install -g wrangler

# Login vào Cloudflare
wrangler login

# Xem logs real-time
wrangler pages deployment tail
```

Sau đó test endpoint trong browser khác để trigger logs.

### Bước 3: Kiểm tra Environment Variables

1. Vào **Settings** → **Environment Variables**
2. Kiểm tra có `NEXT_PUBLIC_API_URL` không
3. Nếu không có, thêm:
   - **Variable name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://api.nhatbinhkt.com` (hoặc `http://157.66.100.32:3001`)
   - **Environment:** Production và Preview

### Bước 4: Redeploy sau khi thêm flag

1. Sau khi thêm compatibility flag và environment variables
2. Vào **Deployments**
3. Click **Retry deployment** hoặc push code mới
4. Đợi build xong
5. Test lại `/api/debug`

## Test sau khi fix

```powershell
# Test GET
Invoke-WebRequest -Uri "https://nhatbinhkt.com/api/debug" -Method GET -UseBasicParsing

# Test POST  
Invoke-WebRequest -Uri "https://nhatbinhkt.com/api/debug" -Method POST -UseBasicParsing
```

**Kết quả mong đợi:**
```json
{
  "status": "ok",
  "message": "Edge Runtime is working",
  "timestamp": 1234567890
}
```

## Nếu vẫn lỗi

Nếu sau khi thêm `nodejs_compat` flag và redeploy vẫn lỗi:

1. **Gửi cho tôi:**
   - Screenshot của Settings → Runtime (để xem compatibility flags)
   - Logs từ Wrangler CLI (nếu có)
   - Cloudflare Ray ID từ Network tab (để tôi có thể check logs)

2. **Có thể cần:**
   - Upgrade Cloudflare plan (một số tính năng cần paid plan)
   - Hoặc thử cách khác để deploy

