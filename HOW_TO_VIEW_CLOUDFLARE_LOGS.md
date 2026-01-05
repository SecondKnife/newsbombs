# Cách xem Logs trên Cloudflare Pages

## Vấn đề

Không thấy tab "Logs" trên Cloudflare Dashboard.

## Các cách xem logs

### Cách 1: Real-time Logs (nếu có)

1. Vào **Workers & Pages** → **newsbombs**
2. Click vào deployment mới nhất
3. Tìm tab **Logs** hoặc **Real-time Logs**
4. Nếu không thấy, có thể cần enable trong Settings

### Cách 2: Workers Logs (nếu Pages không có)

1. Vào **Workers & Pages** → **newsbombs**
2. Vào **Settings** → **Runtime**
3. Tìm phần **Logs** hoặc **Real-time Logs**
4. Enable nếu có option

### Cách 3: Xem qua Browser DevTools

1. Mở browser DevTools (F12)
2. Vào tab **Network**
3. Test endpoint: `https://nhatbinhkt.com/api/debug`
4. Click vào request → Xem **Response** tab
5. Xem **Headers** để biết status code và error details

### Cách 4: Test với curl từ terminal

```bash
# Test GET
curl -v https://nhatbinhkt.com/api/debug

# Test POST
curl -v -X POST https://nhatbinhkt.com/api/debug \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

## Endpoint mới để test

Tôi đã tạo endpoint cực kỳ đơn giản tại `/api/debug`:
- Không có try-catch phức tạp
- Không parse body
- Chỉ return JSON đơn giản

## Sau khi deploy xong

Test endpoint này:
```powershell
Invoke-WebRequest -Uri "https://nhatbinhkt.com/api/debug" -Method GET -UseBasicParsing
```

Nếu endpoint này hoạt động → Edge Runtime OK, vấn đề ở code phức tạp hơn
Nếu endpoint này không hoạt động → Vấn đề với Edge Runtime configuration

## Kiểm tra Compatibility Flags

1. Vào **Settings** → **Runtime**
2. Kiểm tra **Compatibility flags**:
   - Phải có `nodejs_compat`
   - Nếu không có, click **Edit** và thêm flag này
3. Click **Save**
4. Redeploy

## Gửi cho tôi

Sau khi test `/api/debug`, hãy gửi:
1. **Kết quả** từ endpoint `/api/debug` (GET và POST)
2. **Compatibility flags** hiện tại (có `nodejs_compat` không?)
3. **Screenshot** của Settings → Runtime (nếu có thể)

