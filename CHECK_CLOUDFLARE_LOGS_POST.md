# Kiểm tra Logs Cloudflare để Debug POST Error

## Vấn đề

POST endpoint vẫn trả về "Internal Server Error". Đã đổi cách parse body từ `request.text()` sang `request.json()` trực tiếp.

## Đã sửa

1. ✅ Đổi từ `request.text()` sang `request.json()` trực tiếp
2. ✅ Thêm logging chi tiết hơn trong test endpoint
3. ✅ Test endpoint sẽ thử cả hai phương pháp và báo cáo phương pháp nào thành công

## Cách kiểm tra logs trên Cloudflare

### Bước 1: Vào Cloudflare Dashboard

1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vào **Workers & Pages**
3. Chọn project **newsbombs**

### Bước 2: Xem Logs

**Cách 1: Real-time Logs (nếu có)**
1. Vào tab **Logs** hoặc **Real-time Logs**
2. Test POST endpoint trong terminal khác
3. Xem logs xuất hiện real-time

**Cách 2: Function Logs**
1. Vào **Deployments**
2. Click vào deployment mới nhất
3. Tìm tab **Logs** hoặc **Function Logs**
4. Tìm logs có prefix `[LOGIN API]` hoặc `[TEST POST]`

### Bước 3: Test lại POST endpoint

```bash
curl -X POST https://nhatbinhkt.com/api/auth/login/test \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}' \
  -v
```

### Bước 4: Xem logs và gửi cho tôi

Tìm các dòng log có:
- `[TEST POST] Request received`
- `[TEST POST] Successfully parsed with...`
- `[TEST POST] request.json() failed:`
- `[LOGIN API] Parsed body:`
- `[LOGIN API] Error parsing request body:`

## Các khả năng

### 1. Logs hiển thị "Successfully parsed with request.json()"
- ✅ Parse body thành công
- Vấn đề có thể ở phần forward request đến backend

### 2. Logs hiển thị "request.json() failed"
- Edge Runtime không hỗ trợ `request.json()` 
- Cần thử cách khác hoặc kiểm tra Cloudflare Pages config

### 3. Không thấy logs nào
- Có thể logs không được ghi lại
- Hoặc request không đến được Edge Runtime function

## Gửi cho tôi

Sau khi test và xem logs, hãy gửi:
1. **Kết quả** từ curl command
2. **Logs** từ Cloudflare Dashboard (copy/paste các dòng có `[TEST POST]` hoặc `[LOGIN API]`)
3. **Screenshot** của logs (nếu có)

Với thông tin này, tôi có thể fix chính xác hơn.

