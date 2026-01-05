# Hướng dẫn sửa cấu hình DNS cho nhatbinhkt.com

## Vấn đề hiện tại

1. **Root domain (`@`)**: Đang dùng A record trỏ đến IP VPS (`157.66.100.32`) → SAI
2. **WWW subdomain**: Đang trỏ đến `nhatbinhkt.com.` → SAI

## Cách sửa

### Bước 1: Sửa Root Domain (`@`)

**Tùy chọn A: Nếu Mắt Bão cho phép CNAME cho root domain (Khuyến nghị)**

1. Xóa record hiện tại: Row 1 (Host `@`, Type `A`)
2. Thêm record mới:
   - **Host:** `@` (hoặc để trống)
   - **Loại (Type):** `CNAME`
   - **Giá trị (Value):** `newsbombs.pages.dev.` (có dấu chấm ở cuối)
   - **TTL:** `3600`

**Tùy chọn B: Nếu Mắt Bão KHÔNG cho phép CNAME cho root domain**

1. Xóa record hiện tại: Row 1 (Host `@`, Type `A`)
2. Thêm record mới:
   - **Host:** `@` (hoặc để trống)
   - **Loại (Type):** `A`
   - **Giá trị (Value):** `188.114.96.0` (IP của Cloudflare Pages - có thể thay đổi)
   - **TTL:** `3600`

**Lưu ý:** Tốt nhất là chuyển DNS sang Cloudflare để tự động quản lý.

### Bước 2: Sửa WWW Subdomain

1. Click vào icon **Sửa** (pencil) ở Row 10 (Host `www`)
2. Thay đổi:
   - **Host:** `www` (giữ nguyên)
   - **Loại (Type):** `CNAME` (giữ nguyên)
   - **Giá trị (Value):** `newsbombs.pages.dev.` (thay đổi từ `nhatbinhkt.com.`)
   - **TTL:** `3600` (giữ nguyên)
3. Lưu

### Bước 3: Xóa các record không cần thiết (Tùy chọn)

Các record sau không cần thiết cho Cloudflare Pages, bạn có thể xóa:
- `autoconfig` (Row 2)
- `autodiscover` (Row 3)
- `cpanel` (Row 4)
- `cpcalendars` (Row 5)
- `cpcontacts` (Row 6)
- `mail` (Row 8)
- `webmail` (Row 9)

**Giữ lại:**
- `ftp` (Row 7) - nếu bạn cần FTP
- `@` (Root domain) - sau khi sửa
- `www` (Row 10) - sau khi sửa

## Cấu hình đúng sau khi sửa

Sau khi sửa, bạn nên có:

| Host | Loại | Giá trị | TTL |
|------|------|---------|-----|
| `@` | `CNAME` hoặc `A` | `newsbombs.pages.dev.` hoặc IP Cloudflare | `3600` |
| `www` | `CNAME` | `newsbombs.pages.dev.` | `3600` |
| `ftp` | `CNAME` | `nhatbinhkt.com.` (nếu cần) | `3600` |

## Sau khi sửa

1. Đợi 5-15 phút để DNS propagate
2. Kiểm tra: https://www.whatsmydns.net/#CNAME/nhatbinhkt.com
3. Test: Truy cập `https://nhatbinhkt.com` và `https://www.nhatbinhkt.com`

## Lưu ý quan trọng

- Nếu Mắt Bão không cho phép CNAME cho root domain, nên **chuyển DNS sang Cloudflare** (xem hướng dẫn trong `CUSTOM_DOMAIN_SETUP.md`)
- Sau khi sửa DNS, cần thêm custom domain trong Cloudflare Pages dashboard
- SSL certificate sẽ được tự động cấp phát sau 5-15 phút

