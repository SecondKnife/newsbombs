# Kiểm Tra Response Body để Debug Lỗi 500

## Vấn đề

Response là `text/plain` với 21 bytes, có thể là "Internal Server Error". Cần xem response body thực tế để biết lỗi gì.

## Cách xem Response Body

### Trong Browser DevTools:

1. Mở **Developer Tools** (F12)
2. Vào tab **Network**
3. Click vào request `login` (có status 500)
4. Vào tab **Response** (hoặc **Preview**)
5. Xem nội dung response body

### Hoặc dùng curl:

```bash
curl -X POST https://nhatbinhkt.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@newsbombs.com","password":"admin123"}' \
  -v
```

## Các khả năng

### 1. Response là "Internal Server Error"
- Có lỗi xảy ra trong code
- Cần xem logs trên Cloudflare Pages

### 2. Response là JSON với error message
- Code đã chạy nhưng có lỗi khi fetch backend
- Xem `message` và `error` fields trong JSON

### 3. Response là empty hoặc timeout
- Backend không accessible
- Hoặc timeout khi fetch

## Cách xem Logs trên Cloudflare Pages

1. Vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Workers & Pages** → **newsbombs**
3. **Deployments** → Click deployment mới nhất
4. Tìm **Logs** hoặc **Function Logs**
5. Tìm logs có `[LOGIN API]` hoặc `[getApiBaseUrl]`

## Gửi thông tin cho tôi

Sau khi kiểm tra, hãy gửi:
1. **Response body** từ Network tab (toàn bộ nội dung)
2. **Logs** từ Cloudflare Dashboard (nếu có)
3. **Status code** và **headers** (nếu có thông tin thêm)

Với thông tin này, tôi có thể fix chính xác hơn.

