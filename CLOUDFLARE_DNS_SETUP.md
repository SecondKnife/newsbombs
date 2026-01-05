# Hướng dẫn setup DNS trên Cloudflare cho nhatbinhkt.com

## Bước 1: Xóa các records không cần thiết

### Xóa NS records của Mắt Bão (nếu chuyển DNS sang Cloudflare)

1. Chọn Row 3 và Row 4 (NS records: `ns1.matbao.com` và `ns2.matbao.com`)
2. Click **"Delete 2 records"**
3. Xác nhận xóa

**Lưu ý:** Nếu bạn muốn giữ DNS ở Mắt Bão, bỏ qua bước này.

### Xóa record `cpanel` (không cần thiết)

1. Click **"Delete"** ở Row 1 (`cpanel`)
2. Xác nhận xóa

## Bước 2: Sửa record `www`

1. Click **"Delete"** ở Row 2 (`www` - đang trỏ sai đến `nhatbinhkt.com.`)
2. Click **"+ Add record"**
3. Điền thông tin:
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Target:** `newsbombs.pages.dev` (không có dấu chấm ở cuối)
   - **Proxy status:** Bật (orange cloud - Proxied) ✅
   - **TTL:** Auto
4. Click **"Save"**

## Bước 3: Thêm record root domain (`@`)

1. Click **"+ Add record"**
2. Điền thông tin:
   - **Type:** `CNAME`
   - **Name:** `@` (hoặc để trống)
   - **Target:** `newsbombs.pages.dev` (không có dấu chấm ở cuối)
   - **Proxy status:** Bật (orange cloud - Proxied) ✅
   - **TTL:** Auto
3. Click **"Save"**

## Bước 4: Kích hoạt

1. Scroll xuống dưới
2. Click **"Continue to activation"**
3. Đợi Cloudflare cấp SSL certificate (5-15 phút)

## Kết quả mong đợi

Sau khi setup xong, bạn sẽ có 2 records:

| Type | Name | Target | Proxy Status |
|------|------|--------|--------------|
| CNAME | `@` | `newsbombs.pages.dev` | Proxied (orange cloud) |
| CNAME | `www` | `newsbombs.pages.dev` | Proxied (orange cloud) |

## Sau khi setup

1. Đợi 5-15 phút để DNS propagate
2. Kiểm tra: https://www.whatsmydns.net/#CNAME/nhatbinhkt.com
3. Test: 
   - `https://nhatbinhkt.com`
   - `https://www.nhatbinhkt.com`

## Lưu ý quan trọng

### Nếu chuyển DNS sang Cloudflare:

1. Sau khi xóa NS records của Mắt Bão, Cloudflare sẽ hiển thị nameservers mới
2. Copy nameservers từ Cloudflare (ví dụ: `alice.ns.cloudflare.com` và `bob.ns.cloudflare.com`)
3. Vào Mắt Bão → **Quản lý tên miền** → `nhatbinhkt.com`
4. Vào **Nameservers** → Thay đổi thành nameservers của Cloudflare
5. Đợi 24-48 giờ để DNS propagate hoàn toàn

### Nếu giữ DNS ở Mắt Bão:

- Không xóa NS records trên Cloudflare
- Chỉ cần thêm/sửa CNAME records trên Cloudflare
- Cấu hình DNS records trên Mắt Bão như hướng dẫn trong `FIX_DNS_CONFIG.md`

## Troubleshooting

### Domain không hoạt động sau 15 phút

- Kiểm tra DNS propagation: https://www.whatsmydns.net
- Kiểm tra trong Cloudflare Dashboard → **SSL/TLS** → xem certificate status
- Đảm bảo Proxy status là **Proxied** (orange cloud)

### Lỗi SSL Certificate

- Đợi thêm 15-30 phút
- Kiểm tra SSL mode trong Cloudflare Dashboard → **SSL/TLS** → **Overview**
- Đảm bảo SSL mode là **Full** hoặc **Full (strict)**

