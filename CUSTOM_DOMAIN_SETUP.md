# Hướng dẫn kết nối tên miền nhatbinhkt.com với Cloudflare Pages

## Bước 1: Thêm Custom Domain trong Cloudflare Pages

1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vào **Workers & Pages** → chọn project `newsbombs`
3. Vào tab **Custom domains**
4. Click **Set up a custom domain**
5. Nhập tên miền: `nhatbinhkt.com` và `www.nhatbinhkt.com`
6. Click **Continue**

Cloudflare sẽ hiển thị các DNS records cần thêm.

## Bước 2: Cấu hình DNS trên Mắt Bão

Có 2 cách:

### Cách 1: Sử dụng DNS của Mắt Bão (Đơn giản hơn)

1. Đăng nhập vào tài khoản Mắt Bão
2. Vào **Quản lý tên miền** → chọn `nhatbinhkt.com`
3. Vào **Quản lý DNS** hoặc **DNS Records**
4. Thêm các records sau:

#### Record 1: Root domain (nhatbinhkt.com)
- **Type:** `CNAME`
- **Name:** `@` hoặc để trống
- **Value:** `newsbombs.pages.dev`
- **TTL:** `3600` hoặc `Auto`

#### Record 2: WWW subdomain (www.nhatbinhkt.com)
- **Type:** `CNAME`
- **Name:** `www`
- **Value:** `newsbombs.pages.dev`
- **TTL:** `3600` hoặc `Auto`

**Lưu ý:** Nếu Mắt Bão không cho phép CNAME cho root domain (`@`), bạn cần dùng **Cách 2**.

### Cách 2: Chuyển DNS sang Cloudflare (Khuyến nghị)

1. Trong Cloudflare Dashboard, thêm domain `nhatbinhkt.com`
2. Cloudflare sẽ cung cấp 2 nameservers (ví dụ: `alice.ns.cloudflare.com` và `bob.ns.cloudflare.com`)
3. Vào Mắt Bão → **Quản lý tên miền** → `nhatbinhkt.com`
4. Vào **Nameservers** hoặc **DNS Servers**
5. Thay đổi nameservers thành:
   - `alice.ns.cloudflare.com`
   - `bob.ns.cloudflare.com`
6. Lưu và đợi 24-48 giờ để DNS propagate

Sau khi chuyển DNS sang Cloudflare:
- Cloudflare sẽ tự động quản lý DNS records
- Bạn có thể thêm custom domain trong Pages dashboard
- SSL certificate sẽ được tự động cấp phát

## Bước 3: Cập nhật siteUrl trong code

Cập nhật file `data/siteMetadata.js`:

```javascript
siteUrl: 'https://nhatbinhkt.com',
```

## Bước 4: Cập nhật CORS trên Backend

Nếu backend đang chạy trên VPS, cần cập nhật CORS để cho phép domain mới:

1. SSH vào VPS
2. Vào thư mục backend: `cd /www/wwwroot/backend`
3. Mở file `.env`: `nano .env`
4. Cập nhật `FRONTEND_URL`:

```env
FRONTEND_URL=https://nhatbinhkt.com,https://www.nhatbinhkt.com
```

5. Restart backend: `pm2 restart backend` hoặc `pm2 restart all`

## Bước 5: Kiểm tra SSL Certificate

Cloudflare sẽ tự động cấp SSL certificate cho custom domain. Đợi 5-15 phút sau khi thêm domain.

Kiểm tra:
- Vào **SSL/TLS** trong Cloudflare Dashboard
- Đảm bảo SSL mode là **Full** hoặc **Full (strict)**

## Bước 6: Test

Sau khi DNS đã propagate (có thể mất 24-48 giờ):

1. Test root domain: `https://nhatbinhkt.com`
2. Test www subdomain: `https://www.nhatbinhkt.com`
3. Kiểm tra redirect: `http://nhatbinhkt.com` → `https://nhatbinhkt.com`

## Troubleshooting

### Domain không hoạt động sau 24 giờ

1. Kiểm tra DNS propagation: https://www.whatsmydns.net
2. Kiểm tra nameservers: https://mxtoolbox.com/SuperTool.aspx
3. Kiểm tra trong Cloudflare Dashboard → **Custom domains** → xem status

### Lỗi SSL Certificate

- Đợi thêm 15-30 phút
- Kiểm tra SSL mode trong Cloudflare Dashboard
- Đảm bảo DNS records đã được cấu hình đúng

### Backend không kết nối được

- Kiểm tra CORS settings trên backend
- Đảm bảo `FRONTEND_URL` trong `.env` đã được cập nhật
- Restart backend service

## Lưu ý quan trọng

- DNS propagation có thể mất 24-48 giờ
- Cloudflare sẽ tự động redirect HTTP → HTTPS
- Nên sử dụng **Cách 2** (chuyển DNS sang Cloudflare) để có nhiều tính năng hơn và dễ quản lý hơn

