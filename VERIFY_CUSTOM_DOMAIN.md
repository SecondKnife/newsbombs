# Hướng dẫn verify Custom Domain trong Cloudflare Pages

## Tình trạng hiện tại:

✅ Custom domain đã được thêm vào Pages
⏳ Status: **"Verifying"** - Cloudflare đang kiểm tra DNS records
📧 Cloudflare đang recheck DNS records

## Các bước tiếp theo:

### Bước 1: Kiểm tra DNS Records trên Cloudflare

1. Vào Cloudflare Dashboard
2. Chọn domain `nhatbinhkt.com`
3. Vào tab **DNS** → **Records**

**Cần có record sau:**

| Name | Type | Target | Proxy Status |
|------|------|--------|--------------|
| `@` hoặc để trống | `CNAME` | `newsbombs.pages.dev` | Proxied (orange cloud) |

**Nếu chưa có:**
- Click **"+ Add record"**
- **Name:** Để trống hoặc `@`
- **Type:** `CNAME`
- **Target:** `newsbombs.pages.dev`
- **Proxy status:** Bật (Proxied - orange cloud)
- **TTL:** Auto
- Click **Save**

### Bước 2: Click "Check DNS records" (Nếu có)

1. Ở màn hình Custom domains hiện tại
2. Tìm nút **"Check DNS records"** hoặc **"Verify DNS"**
3. Click để Cloudflare verify lại DNS records

**Hoặc:**
- Cloudflare đang tự động recheck (như thông báo đã hiển thị)
- Đợi Cloudflare tự động verify

### Bước 3: Đợi Domain được kích hoạt

**Thời gian:**
- Thường mất **5-15 phút**
- Có thể mất đến **24-48 giờ** trong một số trường hợp

**Cloudflare sẽ:**
- Tự động verify DNS records
- Cấp SSL certificate
- Kích hoạt domain
- Gửi email thông báo khi domain được kích hoạt

### Bước 4: Kiểm tra Status

Sau khi đợi, kiểm tra:

1. Vào **Custom domains** trong Pages
2. Status sẽ chuyển từ:
   - **"Verifying"** (vàng) → **"Active"** (xanh)

### Bước 5: Test Domain

Sau khi status là **"Active"**:

1. **Test root domain:**
   - `https://nhatbinhkt.com`
   - Phải hiển thị website bình thường

2. **Test www subdomain:**
   - `https://www.nhatbinhkt.com`
   - Phải hiển thị website bình thường

## Troubleshooting:

### Status vẫn là "Verifying" sau 1 giờ

**Nguyên nhân:**
- DNS records chưa đúng
- DNS chưa propagate hoàn toàn

**Cách sửa:**
1. Kiểm tra DNS records trên Cloudflare:
   - Phải có `@` → CNAME → `newsbombs.pages.dev` (Proxied)
2. Kiểm tra DNS propagation:
   - https://www.whatsmydns.net/#CNAME/nhatbinhkt.com
3. Click **"Check DNS records"** lại
4. Đợi thêm thời gian

### DNS records đã đúng nhưng vẫn "Verifying"

**Nguyên nhân:**
- Cloudflare chưa detect được records
- DNS chưa propagate hoàn toàn

**Cách sửa:**
1. Đợi thêm 15-30 phút
2. Click **"Check DNS records"** lại
3. Kiểm tra Proxy status phải là **Proxied** (orange cloud)

### Nhận được email lỗi

**Kiểm tra:**
- DNS records có đúng không
- Nameservers đã propagate chưa
- Proxy status có phải Proxied không

**Cách sửa:**
- Sửa DNS records theo hướng dẫn
- Đợi thêm thời gian
- Thử lại

## Checklist:

- [ ] DNS records đã được cấu hình đúng trên Cloudflare (`@` → CNAME → `newsbombs.pages.dev`, Proxied)
- [ ] Đã click "Check DNS records" (nếu có)
- [ ] Đã đợi 5-15 phút
- [ ] Status đã chuyển thành "Active"
- [ ] Đã nhận email thông báo (nếu có)
- [ ] Domain đã hoạt động tại `https://nhatbinhkt.com`

## Timeline dự kiến:

- **0-15 phút:** Cloudflare verify DNS records
- **15-30 phút:** SSL certificate được cấp
- **30 phút+:** Domain hoạt động

## Lưu ý:

- ✅ Cloudflare đang tự động recheck DNS records
- ✅ Bạn sẽ nhận email khi domain được kích hoạt
- ✅ Domain sẽ tự động enable nếu DNS records đúng
- ⏰ Cần thời gian để DNS propagate hoàn toàn

