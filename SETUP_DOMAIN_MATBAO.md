# Hướng dẫn setup domain nhatbinhkt.com (Giữ DNS ở Mắt Bão)

## Bước 1: Cấu hình DNS trên Mắt Bão

1. Đăng nhập vào tài khoản Mắt Bão
2. Vào **Quản lý tên miền** → chọn `nhatbinhkt.com`
3. Vào **Quản lý DNS** hoặc **DNS Records**

### Thêm/Sửa các records sau:

#### Record 1: Root domain (`@`)
- **Host:** `@` (hoặc để trống)
- **Loại (Type):** `CNAME`
- **Giá trị (Value):** `newsbombs.pages.dev.` (có dấu chấm ở cuối)
- **TTL:** `3600`

**Lưu ý:** Nếu Mắt Bão không cho phép CNAME cho root domain, dùng:
- **Loại (Type):** `A`
- **Giá trị (Value):** `188.114.96.0` (IP của Cloudflare Pages)

#### Record 2: WWW subdomain (`www`)
- **Host:** `www`
- **Loại (Type):** `CNAME`
- **Giá trị (Value):** `newsbombs.pages.dev.` (có dấu chấm ở cuối)
- **TTL:** `3600`

### Xóa các records không cần thiết (nếu có):
- `cpanel` → `newsbombs.pages.dev.` (không cần)
- `autoconfig` → `newsbombs.pages.dev.` (không cần)
- `autodiscover` → `newsbombs.pages.dev.` (không cần)
- `mail` → `newsbombs.pages.dev.` (không cần)
- `webmail` → `newsbombs.pages.dev.` (không cần)

**Giữ lại:**
- `ftp` → `nhatbinhkt.com.` (nếu bạn cần FTP)

## Bước 2: Thêm Custom Domain trong Cloudflare Pages

1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vào **Workers & Pages** → chọn project `newsbombs`
3. Vào tab **Custom domains**
4. Click **Set up a custom domain**
5. Nhập tên miền: `nhatbinhkt.com`
6. Click **Continue**
7. Lặp lại cho `www.nhatbinhkt.com`

Cloudflare sẽ tự động kiểm tra DNS records và cấp SSL certificate.

## Bước 3: Đợi DNS propagate

- Thường mất 5-15 phút
- Có thể mất đến 24-48 giờ trong một số trường hợp
- Kiểm tra: https://www.whatsmydns.net/#CNAME/nhatbinhkt.com

## Bước 4: Test

Sau khi DNS đã propagate:

1. Test root domain: `https://nhatbinhkt.com`
2. Test www subdomain: `https://www.nhatbinhkt.com`
3. Kiểm tra redirect: `http://nhatbinhkt.com` → `https://nhatbinhkt.com`

## Kết quả mong đợi

Sau khi setup xong, trên Mắt Bão bạn sẽ có:

| Host | Loại | Giá trị | TTL |
|------|------|---------|-----|
| `@` | `CNAME` hoặc `A` | `newsbombs.pages.dev.` hoặc IP Cloudflare | `3600` |
| `www` | `CNAME` | `newsbombs.pages.dev.` | `3600` |
| `ftp` | `CNAME` | `nhatbinhkt.com.` (nếu cần) | `3600` |

## Troubleshooting

### Domain không hoạt động sau 24 giờ

1. Kiểm tra DNS propagation: https://www.whatsmydns.net
2. Kiểm tra trong Cloudflare Dashboard → **Custom domains** → xem status
3. Đảm bảo DNS records trên Mắt Bão đã được cấu hình đúng

### Lỗi SSL Certificate

- Đợi thêm 15-30 phút
- Kiểm tra trong Cloudflare Dashboard → **Custom domains** → xem SSL status
- Đảm bảo DNS records đã được cấu hình đúng

### Backend không kết nối được

- Cập nhật CORS trên backend (xem `CUSTOM_DOMAIN_SETUP.md`)

## Lưu ý quan trọng

- **KHÔNG cần** thay đổi nameservers nếu giữ DNS ở Mắt Bão
- **KHÔNG cần** xóa NS records trên Cloudflare
- Chỉ cần cấu hình DNS records trên Mắt Bão và thêm custom domain trong Cloudflare Pages

