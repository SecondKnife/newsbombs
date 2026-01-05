# Test POST Endpoint để Debug

## Vấn đề

GET API hoạt động nhưng POST không được. Có thể là vấn đề với cách parse request body trong Edge Runtime.

## Đã sửa

1. ✅ Đổi cách parse request body: dùng `request.text()` trước, sau đó parse JSON
2. ✅ Thêm logging chi tiết để debug
3. ✅ Thêm POST test endpoint tại `/api/auth/login/test`

## Cách test

### Bước 1: Test POST endpoint đơn giản

```bash
curl -X POST https://nhatbinhkt.com/api/auth/login/test \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}' \
  -v
```

**Kết quả mong đợi:**
```json
{
  "message": "POST endpoint is working",
  "receivedBody": {"test":"data"},
  "timestamp": "..."
}
```

### Bước 2: Test login endpoint

```bash
curl -X POST https://nhatbinhkt.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}' \
  -v
```

### Bước 3: Xem logs trên Cloudflare

1. Vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Workers & Pages** → **newsbombs**
3. **Deployments** → deployment mới nhất
4. Tìm **Logs** hoặc **Function Logs**
5. Tìm logs có:
   - `[LOGIN API] Request body text:`
   - `[LOGIN API] Forwarding login request to:`

## Các khả năng

### 1. POST endpoint test hoạt động
- Edge Runtime có thể parse POST requests
- Vấn đề có thể ở cách forward request đến backend

### 2. POST endpoint test không hoạt động
- Edge Runtime có vấn đề với POST requests
- Cần kiểm tra Cloudflare Pages configuration

### 3. Login endpoint vẫn lỗi nhưng test endpoint OK
- Vấn đề ở cách forward request đến backend
- Cần kiểm tra tunnel endpoint

## Gửi kết quả cho tôi

Sau khi test, hãy gửi:
1. **Kết quả** từ POST test endpoint
2. **Kết quả** từ login endpoint
3. **Logs** từ Cloudflare Dashboard (nếu có)

Với thông tin này, tôi có thể fix chính xác hơn.

