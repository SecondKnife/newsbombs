# Hướng dẫn giữ DNS ở Mắt Bão nhưng dùng Cloudflare Pages

## ⚠️ Lưu ý quan trọng

Cloudflare Pages **thường yêu cầu** DNS phải được quản lý bởi Cloudflare để có thể thêm custom domain. Tuy nhiên, bạn có thể thử cách sau:

## Cách 1: Thử giữ DNS ở Mắt Bão (Có thể không hoạt động)

### Trên Cloudflare (màn hình hiện tại):

1. **Xóa records không cần thiết:**
   - Chọn Row 1 (`cpanel`) và Row 2 (`www`)
   - Click **"Delete 2 records"**

2. **Thêm records đúng:**
   - Click **"+ Add record"**
   - Thêm `@` → `CNAME` → `newsbombs.pages.dev` (Proxied)
   - Thêm `www` → `CNAME` → `newsbombs.pages.dev` (Proxied)

3. **Giữ NS records của Mắt Bão:**
   - **KHÔNG xóa** Row 3 và Row 4 (NS records)
   - Giữ nguyên `ns1.matbao.com` và `ns2.matbao.com`

4. **Click "Continue to activation"**

### Trên Mắt Bão:

1. Vào **Quản lý tên miền** → `nhatbinhkt.com`
2. Vào **Quản lý DNS**
3. Thêm/sửa records:
   - `@` → `A` record → `172.66.47.133` (IP Cloudflare)
   - `www` → `CNAME` → `newsbombs.pages.dev.`

### Thử thêm Custom Domain vào Pages:

1. Vào **Workers & Pages** → project `newsbombs`
2. Vào **Custom domains**
3. Thử thêm `nhatbinhkt.com`

**Nếu không được:** Cloudflare sẽ báo lỗi và yêu cầu chuyển DNS.

## Cách 2: Chuyển DNS sang Cloudflare (Khuyến nghị - Đảm bảo hoạt động)

Nếu Cách 1 không hoạt động, bạn cần chuyển DNS sang Cloudflare:

### Bước 1: Lấy Nameservers từ Cloudflare

1. Ở màn hình hiện tại, scroll xuống dưới
2. Cloudflare sẽ hiển thị 2 nameservers (ví dụ: `alice.ns.cloudflare.com` và `bob.ns.cloudflare.com`)
3. Copy 2 nameservers này

### Bước 2: Cập nhật Nameservers trên Mắt Bão

1. Đăng nhập vào Mắt Bão
2. Vào **Quản lý tên miền** → `nhatbinhkt.com`
3. Vào **Nameservers** hoặc **DNS Servers**
4. Thay đổi nameservers thành:
   - Nameserver 1: `alice.ns.cloudflare.com` (từ Cloudflare)
   - Nameserver 2: `bob.ns.cloudflare.com` (từ Cloudflare)
5. Lưu

### Bước 3: Đợi DNS propagate

- Thường mất 5-15 phút
- Kiểm tra: https://www.whatsmydns.net/#NS/nhatbinhkt.com

### Bước 4: Thêm Custom Domain vào Pages

1. Vào **Workers & Pages** → project `newsbombs`
2. Vào **Custom domains**
3. Click **Set up a custom domain**
4. Nhập: `nhatbinhkt.com`
5. Click **Continue**

## Lợi ích khi chuyển DNS sang Cloudflare

- ✅ **Đảm bảo hoạt động** với Cloudflare Pages
- ✅ SSL certificate tự động
- ✅ DDoS protection
- ✅ CDN và caching
- ✅ Có thể dùng CNAME cho root domain
- ✅ Quản lý DNS dễ dàng hơn

## Quan trọng

**Domain vẫn thuộc về bạn** - chỉ thay đổi nơi quản lý DNS:
- Domain vẫn đăng ký ở Mắt Bão
- Chỉ nameservers được thay đổi
- Bạn có thể chuyển lại bất cứ lúc nào

## Khuyến nghị

**Nên chuyển DNS sang Cloudflare** vì:
1. Cloudflare Pages yêu cầu DNS ở Cloudflare
2. Dễ quản lý hơn
3. Nhiều tính năng bảo mật và tối ưu hơn
4. Domain vẫn thuộc về bạn

