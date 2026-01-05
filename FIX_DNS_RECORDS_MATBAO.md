# Sửa DNS Records trên Mắt Bão - Bước cuối cùng

## ✅ Đã hoàn thành:
- Nameservers đã được cập nhật đúng: `aryanna.ns.cloudflare.com` và `aragorn.ns.cloudflare.com`

## ❌ Cần sửa:

### 1. Xóa NS record cho `@` (Row 10)

**Vấn đề:** Row 10 có Type `NS` cho Host `@` - điều này không đúng. NS records chỉ nên ở phần Nameservers, không phải trong DNS records.

**Cách sửa:**
1. Chọn Row 10 (Host `@`, Type `NS`)
2. Click icon **Delete** (trash can)
3. Xác nhận xóa

### 2. Thêm A record cho root domain (`@`)

**Cần thêm:**
1. Click **"Thêm bản ghi"** hoặc nút tương tự
2. Điền:
   - **Host:** `@` (hoặc để trống)
   - **Loại:** `A` (không phải NS)
   - **Giá trị:** `172.66.47.133` (IP Cloudflare Pages)
   - **TTL:** `3600` hoặc `1 Giờ`
3. Click **Lưu** hoặc **Thêm**

### 3. Xóa các records không cần thiết (Tùy chọn)

Các records sau không cần cho Cloudflare Pages:
- `autoconfig` (Row 1)
- `autodiscover` (Row 2)
- `cpanel` (Row 3)
- `cpcalendars` (Row 4)
- `cpcontacts` (Row 5)
- `ftp` (Row 6) - **Giữ lại nếu cần FTP**
- `mail` (Row 7)
- `webmail` (Row 8)

**Giữ lại:**
- `www` (Row 9) - Đã đúng ✅
- `ftp` (Row 6) - Nếu bạn cần FTP

## Kết quả mong đợi sau khi sửa:

| Host | Loại | Giá trị | TTL |
|------|------|---------|-----|
| `@` | `A` | `172.66.47.133` | `3600` |
| `www` | `CNAME` | `newsbombs.pages.dev.` | `3600` |
| `ftp` | `CNAME` | `newsbombs.pages.dev.` (hoặc giữ nguyên) | `3600` |

## Sau khi sửa xong:

1. **Đợi 5-15 phút** để DNS propagate
2. **Kiểm tra:** https://www.whatsmydns.net/#A/nhatbinhkt.com
3. **Test:** Truy cập `https://nhatbinhkt.com` và `https://www.nhatbinhkt.com`

## Lưu ý:

- **Nameservers đã đúng** - không cần sửa gì ở phần Nameservers
- **Chỉ cần sửa DNS records** - thêm A record cho `@` và xóa NS record sai
- **Đợi thời gian** - DNS cần thời gian để propagate

