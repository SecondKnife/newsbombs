# Domain đã được thêm vào Cloudflare - Các bước tiếp theo

## Tình trạng hiện tại:
✅ Domain `nhatbinhkt.com` đã được thêm vào Cloudflare account

## Các bước tiếp theo:

### Bước 1: Vào Domain Overview

1. Click vào link **"nhatbinhkt.com overview"** (màu đỏ trong thông báo)
2. Hoặc vào Cloudflare Dashboard → chọn domain `nhatbinhkt.com`

### Bước 2: Kiểm tra và cấu hình DNS Records

1. Vào tab **DNS** → **Records**
2. Kiểm tra xem có các records sau chưa:

**Cần có:**
- `@` → `CNAME` → `newsbombs.pages.dev` (Proxy status: **Proxied** - orange cloud)
- `www` → `CNAME` → `newsbombs.pages.dev` (Proxy status: **Proxied** - orange cloud)

**Nếu chưa có:**
1. Click **"+ Add record"**
2. Thêm `@` → `CNAME` → `newsbombs.pages.dev` (Proxied)
3. Thêm `www` → `CNAME` → `newsbombs.pages.dev` (Proxied)

### Bước 3: Thêm Custom Domain vào Cloudflare Pages

1. Vào **Workers & Pages** (menu bên trái)
2. Chọn project `newsbombs`
3. Vào tab **Custom domains**
4. Click **"Set up a custom domain"**
5. Nhập: `nhatbinhkt.com`
6. Click **Continue**
7. Lặp lại cho `www.nhatbinhkt.com`

### Bước 4: Kiểm tra Nameservers

1. Vào tab **Overview** trong domain `nhatbinhkt.com`
2. Kiểm tra nameservers hiển thị:
   - Phải là: `aragorn.ns.cloudflare.com` và `aryanna.ns.cloudflare.com`
3. Nếu chưa đúng, cập nhật trên Mắt Bão (xem `UPDATE_NAMESERVERS_MATBAO.md`)

### Bước 5: Đợi và test

1. **Đợi 5-15 phút** để:
   - DNS propagate
   - SSL certificate được cấp
2. **Kiểm tra:**
   - https://www.whatsmydns.net/#CNAME/nhatbinhkt.com
   - https://nhatbinhkt.com
   - https://www.nhatbinhkt.com

## Checklist:

- [ ] Đã vào domain overview
- [ ] DNS records đã được cấu hình đúng (`@` và `www` → `newsbombs.pages.dev`, Proxied)
- [ ] Nameservers đã được cập nhật trên Mắt Bão
- [ ] Custom domain đã được thêm vào Cloudflare Pages
- [ ] Đã đợi 5-15 phút
- [ ] Domain đã hoạt động

## Nếu domain vẫn chưa hoạt động:

1. Kiểm tra DNS propagation: https://www.whatsmydns.net
2. Kiểm tra SSL certificate trong Cloudflare Dashboard → **SSL/TLS** → **Overview**
3. Kiểm tra Custom domains status trong Pages dashboard
4. Đợi thêm thời gian (có thể mất đến 48 giờ)

## Lưu ý:

- Domain đã được thêm vào Cloudflare → tốt!
- Bây giờ chỉ cần cấu hình DNS records và thêm vào Pages
- Đảm bảo Proxy status là **Proxied** (orange cloud) cho cả `@` và `www`

