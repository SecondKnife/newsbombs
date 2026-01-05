# Fix Runtime Configuration - Compatibility Flag đã có nhưng vẫn lỗi

## Tình trạng hiện tại

✅ **Compatibility flags:** `nodejs_compat` đã được set
✅ **Compatibility date:** Jan 1, 2024
✅ **Placement:** Default

Nhưng vẫn bị lỗi 500 Internal Server Error.

## Các bước cần làm

### Bước 1: Redeploy sau khi set flag

**QUAN TRỌNG:** Sau khi thêm/sửa compatibility flags, bạn PHẢI redeploy để áp dụng:

1. Vào **Deployments** tab
2. Click vào deployment mới nhất
3. Click **Retry deployment** hoặc **Redeploy**
4. Đợi build xong (2-3 phút)
5. Test lại `/api/debug`

### Bước 2: Kiểm tra Compatibility Date

Compatibility date hiện tại là "Jan 1, 2024". Hãy thử update lên date mới hơn:

1. Vào **Settings** → **Runtime**
2. Click **Edit** bên cạnh **Compatibility date**
3. Thử đổi thành: **Jan 1, 2025** hoặc date mới nhất
4. Click **Save**
5. Redeploy lại

### Bước 3: Xem Logs qua Wrangler CLI

Nếu vẫn lỗi sau khi redeploy, cần xem logs để biết lỗi cụ thể:

```bash
# Install Wrangler (nếu chưa có)
npm install -g wrangler

# Login vào Cloudflare
wrangler login

# Xem logs real-time
wrangler pages deployment tail --project-name=newsbombs
```

Sau đó test endpoint trong browser để trigger logs.

### Bước 4: Kiểm tra Environment Variables

1. Vào **Settings** → **Environment Variables**
2. Kiểm tra có `NEXT_PUBLIC_API_URL` không
3. Nếu không có, thêm:
   - **Variable name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://api.nhatbinhkt.com`
   - **Environment:** Production và Preview

## Test sau khi redeploy

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

## Nếu vẫn lỗi sau khi redeploy

1. **Gửi cho tôi:**
   - Logs từ Wrangler CLI (nếu có)
   - Cloudflare Ray ID từ Network tab (để check logs)
   - Screenshot của error response

2. **Có thể cần:**
   - Update `@cloudflare/next-on-pages` lên version mới hơn
   - Hoặc thử cách khác để deploy

