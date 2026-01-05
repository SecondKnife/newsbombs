# Hướng dẫn thêm domain vào Cloudflare DNS (trước khi thêm vào Pages)

## Bước 1: Thêm domain vào Cloudflare DNS

1. Vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **"Add a site"** hoặc **"Add site"** ở góc trên bên phải
3. Nhập domain: `nhatbinhkt.com`
4. Click **"Add site"**
5. Chọn plan (Free plan là đủ)
6. Click **"Continue"**

## Bước 2: Cloudflare sẽ quét DNS records hiện tại

Cloudflare sẽ tự động quét và import các DNS records từ Mắt Bão.

## Bước 3: Cập nhật DNS records trên Cloudflare

Sau khi import, bạn cần cập nhật:

1. **Root domain (`@`)**:
   - Type: `CNAME`
   - Name: `@`
   - Target: `newsbombs.pages.dev`
   - Proxy status: **Proxied** (orange cloud) ✅
   - TTL: Auto

2. **WWW subdomain (`www`)**:
   - Type: `CNAME`
   - Name: `www`
   - Target: `newsbombs.pages.dev`
   - Proxy status: **Proxied** (orange cloud) ✅
   - TTL: Auto

3. Xóa các records không cần thiết (nếu có):
   - `cpanel`, `autoconfig`, `autodiscover`, `mail`, `webmail`, etc.

## Bước 4: Lấy Nameservers từ Cloudflare

1. Sau khi thêm domain, Cloudflare sẽ hiển thị 2 nameservers
2. Copy 2 nameservers (ví dụ: `alice.ns.cloudflare.com` và `bob.ns.cloudflare.com`)

## Bước 5: Cập nhật Nameservers trên Mắt Bão

1. Đăng nhập vào Mắt Bão
2. Vào **Quản lý tên miền** → `nhatbinhkt.com`
3. Vào **Nameservers** hoặc **DNS Servers**
4. Thay đổi nameservers thành:
   - Nameserver 1: `alice.ns.cloudflare.com` (từ Cloudflare)
   - Nameserver 2: `bob.ns.cloudflare.com` (từ Cloudflare)
5. Lưu

## Bước 6: Đợi DNS propagate

- Thường mất 5-15 phút
- Có thể mất đến 24-48 giờ trong một số trường hợp
- Kiểm tra: https://www.whatsmydns.net/#NS/nhatbinhkt.com

## Bước 7: Thêm Custom Domain vào Pages

Sau khi DNS đã propagate:

1. Vào **Workers & Pages** → chọn project `newsbombs`
2. Vào tab **Custom domains**
3. Click **Set up a custom domain**
4. Nhập: `nhatbinhkt.com`
5. Click **Continue**
6. Lặp lại cho `www.nhatbinhkt.com`

Cloudflare sẽ tự động cấp SSL certificate.

## Lợi ích của việc chuyển DNS sang Cloudflare

- ✅ Tự động quản lý DNS
- ✅ SSL certificate tự động
- ✅ DDoS protection
- ✅ CDN và caching
- ✅ Analytics và insights
- ✅ Có thể dùng CNAME cho root domain (CNAME flattening)

## Troubleshooting

### Nameservers không hoạt động sau 24 giờ

- Kiểm tra nameservers đã được cập nhật đúng chưa
- Kiểm tra DNS propagation: https://www.whatsmydns.net
- Đảm bảo đã xóa nameservers cũ trên Mắt Bão

### Domain không hoạt động

- Kiểm tra DNS records trên Cloudflare đã đúng chưa
- Đảm bảo Proxy status là **Proxied** (orange cloud)
- Kiểm tra SSL certificate trong Cloudflare Dashboard

