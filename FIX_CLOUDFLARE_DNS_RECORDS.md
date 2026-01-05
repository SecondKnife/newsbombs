# Sửa DNS Records trên Cloudflare

## Tình trạng hiện tại:

✅ Row 1: CNAME - `nhatbinhkt.com` → `newsbombs.pages.dev` (Proxied) - **Cần sửa Name**
✅ Row 2: CNAME - `www` → `newsbombs.pages.dev` (Proxied) - **Đúng rồi**
❌ Row 3: NS - `ns2.matbao.com` - **Cần xóa**
❌ Row 4: NS - `ns1.matbao.com` - **Cần xóa**

## Các bước sửa:

### Bước 1: Sửa Row 1 (Root domain)

1. Click **"Edit"** ở Row 1 (CNAME - nhatbinhkt.com)
2. Thay đổi:
   - **Name:** Đổi từ `nhatbinhkt.com` → `@` (hoặc để trống)
   - **Type:** Giữ nguyên `CNAME`
   - **Content:** Giữ nguyên `newsbombs.pages.dev`
   - **Proxy status:** Giữ nguyên `Proxied` (orange cloud)
   - **TTL:** Giữ nguyên `Auto`
3. Click **"Save"**

**Lưu ý:** Name phải là `@` (hoặc để trống) để đại diện cho root domain.

### Bước 2: Xóa NS Records của Mắt Bão

1. Chọn Row 3 (NS - ns2.matbao.com) - click checkbox
2. Chọn Row 4 (NS - ns1.matbao.com) - click checkbox
3. Click **"Delete"** hoặc chọn "Delete 2 records"
4. Xác nhận xóa

**Lưu ý:** NS records này không cần vì bạn đã chuyển DNS sang Cloudflare. Cloudflare sẽ tự động quản lý NS records.

### Bước 3: Kiểm tra Custom Domain trong Pages

1. Vào **Workers & Pages** (menu bên trái)
2. Chọn project `newsbombs`
3. Vào tab **Custom domains**
4. Kiểm tra xem có `nhatbinhkt.com` chưa

**Nếu chưa có:**
1. Click **"Set up a custom domain"**
2. Nhập: `nhatbinhkt.com`
3. Click **Continue**

### Bước 4: Xử lý cảnh báo "Pending"

Cảnh báo "pending" có thể do:
- Domain chưa được verify ownership
- Nameservers chưa được cập nhật đúng

**Cách xử lý:**
1. Vào tab **Overview** trong domain `nhatbinhkt.com`
2. Làm theo hướng dẫn để verify ownership (nếu có)
3. Đảm bảo nameservers đã được cập nhật trên Mắt Bão

## Kết quả mong đợi sau khi sửa:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| CNAME | `@` | `newsbombs.pages.dev` | Proxied (orange cloud) |
| CNAME | `www` | `newsbombs.pages.dev` | Proxied (orange cloud) |

**Không còn:**
- NS records của Mắt Bão
- Record với Name `nhatbinhkt.com` (phải là `@`)

## Sau khi sửa xong:

1. **Đợi 5-15 phút** để DNS propagate
2. **Kiểm tra:** https://www.whatsmydns.net/#CNAME/nhatbinhkt.com
3. **Test:** 
   - `https://nhatbinhkt.com`
   - `https://www.nhatbinhkt.com`

## Troubleshooting:

### Cảnh báo "Pending" vẫn còn

- Kiểm tra nameservers trên Mắt Bão đã được cập nhật chưa
- Đợi thêm thời gian (có thể mất đến 24 giờ)
- Kiểm tra trong Cloudflare Dashboard → **Overview** → xem có hướng dẫn verify không

### Domain vẫn chưa hoạt động

- Kiểm tra DNS propagation: https://www.whatsmydns.net
- Kiểm tra Custom domain status trong Pages dashboard
- Đảm bảo Proxy status là **Proxied** (orange cloud)

