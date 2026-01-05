# Hướng dẫn thêm Custom Domain vào Cloudflare Pages

## Tình trạng hiện tại:

✅ DNS records đã được cấu hình đúng trên Cloudflare:
- `nhatbinhkt.com` → CNAME → `newsbombs.pages.dev` (Proxied)
- `www` → CNAME → `newsbombs.pages.dev` (Proxied)

❌ Custom domain chưa được thêm vào Pages

## Các bước thêm Custom Domain:

### Bước 1: Click "Set up a custom domain"

1. Ở màn hình hiện tại (Custom domains tab)
2. Click nút **"Set up a custom domain"** (màu xanh)

### Bước 2: Nhập domain

1. Trong popup/modal hiện ra
2. Nhập domain: `nhatbinhkt.com`
3. Click **"Continue"** hoặc **"Add"**

### Bước 3: Cloudflare kiểm tra DNS

Cloudflare sẽ tự động kiểm tra:
- ✅ DNS records đã trỏ đến `newsbombs.pages.dev` chưa
- ✅ Nameservers đã được cập nhật chưa
- ✅ Domain đã được thêm vào Cloudflare DNS chưa

**Nếu DNS đã đúng:**
- Domain sẽ được thêm vào ngay
- Cloudflare sẽ bắt đầu cấp SSL certificate

**Nếu DNS chưa đúng:**
- Cloudflare sẽ hiển thị hướng dẫn sửa
- Làm theo hướng dẫn để sửa DNS records

### Bước 4: Đợi kích hoạt

1. **Đợi 5-15 phút** để:
   - Cloudflare verify domain
   - SSL certificate được cấp
   - Domain được kích hoạt

2. **Kiểm tra:**
   - Domain sẽ xuất hiện trong danh sách Custom domains
   - Status sẽ chuyển từ "Pending" → "Active"

### Bước 5: Thêm www subdomain (Tùy chọn)

Sau khi `nhatbinhkt.com` đã được thêm:

1. Click **"Set up a custom domain"** lần nữa
2. Nhập: `www.nhatbinhkt.com`
3. Click **"Continue"**

## Kết quả mong đợi:

Sau khi thêm xong, bạn sẽ thấy:

| Domain | Status | SSL |
|--------|--------|-----|
| `nhatbinhkt.com` | Active | Valid |
| `www.nhatbinhkt.com` | Active | Valid |

## Troubleshooting:

### Domain không được thêm vào

**Nguyên nhân có thể:**
1. DNS records chưa đúng
2. Nameservers chưa được cập nhật
3. Domain chưa được thêm vào Cloudflare DNS

**Cách sửa:**
1. Kiểm tra DNS records trong Cloudflare Dashboard → DNS → Records
2. Đảm bảo có:
   - `nhatbinhkt.com` → CNAME → `newsbombs.pages.dev` (Proxied)
   - `www` → CNAME → `newsbombs.pages.dev` (Proxied)
3. Kiểm tra nameservers đã được cập nhật trên Mắt Bão chưa

### Status vẫn là "Pending"

**Nguyên nhân:**
- SSL certificate chưa được cấp
- DNS chưa propagate hoàn toàn

**Cách sửa:**
- Đợi thêm 5-15 phút
- Kiểm tra DNS propagation: https://www.whatsmydns.net
- Kiểm tra SSL trong Cloudflare Dashboard → SSL/TLS

### Lỗi "Domain not found" hoặc "DNS not configured"

**Nguyên nhân:**
- DNS records chưa được cấu hình đúng
- Nameservers chưa được cập nhật

**Cách sửa:**
1. Vào Cloudflare Dashboard → DNS → Records
2. Đảm bảo có records đúng (xem Bước 3)
3. Kiểm tra nameservers trên Mắt Bão

## Sau khi domain đã được thêm:

1. **Đợi 5-15 phút** để SSL certificate được cấp
2. **Test domain:**
   - `https://nhatbinhkt.com`
   - `https://www.nhatbinhkt.com`
3. **Kiểm tra:**
   - Website hiển thị đúng
   - SSL certificate hợp lệ (không có cảnh báo)
   - Redirect từ HTTP → HTTPS hoạt động

## Checklist:

- [ ] DNS records đã được cấu hình đúng trên Cloudflare
- [ ] Nameservers đã được cập nhật trên Mắt Bão
- [ ] Đã click "Set up a custom domain"
- [ ] Đã nhập domain `nhatbinhkt.com`
- [ ] Domain đã xuất hiện trong danh sách
- [ ] Status đã chuyển thành "Active"
- [ ] Đã đợi 5-15 phút
- [ ] Domain đã hoạt động

