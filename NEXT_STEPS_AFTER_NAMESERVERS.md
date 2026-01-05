# Các bước tiếp theo sau khi cập nhật Nameservers

## ✅ Đã hoàn thành:
- Nameservers đã được cập nhật trên Mắt Bão

## Các bước tiếp theo:

### Bước 1: Đợi DNS Propagate

**Thời gian:**
- Thường mất **5-15 phút**
- Có thể mất đến **24-48 giờ** trong một số trường hợp

**Kiểm tra:**
- https://www.whatsmydns.net/#NS/nhatbinhkt.com
- Kết quả phải hiển thị:
  - `aragorn.ns.cloudflare.com`
  - `aryanna.ns.cloudflare.com`

### Bước 2: Kiểm tra DNS Records trên Cloudflare

1. Vào Cloudflare Dashboard
2. Chọn domain `nhatbinhkt.com`
3. Vào tab **DNS** → **Records**
4. Đảm bảo có:
   - `nhatbinhkt.com` (hoặc `@`) → CNAME → `newsbombs.pages.dev` (Proxied)
   - `www` → CNAME → `newsbombs.pages.dev` (Proxied)

**Nếu chưa có:**
- Click **"+ Add record"**
- Thêm các records trên

### Bước 3: Thêm Custom Domain vào Cloudflare Pages

1. Vào **Workers & Pages** (menu bên trái)
2. Chọn project `newsbombs`
3. Vào tab **Custom domains**
4. Click **"Set up a custom domain"**
5. Nhập: `nhatbinhkt.com`
6. Click **Continue**

**Cloudflare sẽ:**
- Tự động kiểm tra DNS records
- Cấp SSL certificate (5-15 phút)
- Kích hoạt domain

### Bước 4: Thêm www subdomain (Tùy chọn)

Sau khi `nhatbinhkt.com` đã được thêm:

1. Click **"Set up a custom domain"** lần nữa
2. Nhập: `www.nhatbinhkt.com`
3. Click **Continue**

### Bước 5: Đợi SSL Certificate

**Thời gian:** 5-15 phút

**Kiểm tra:**
- Vào Cloudflare Dashboard → domain `nhatbinhkt.com`
- Tab **SSL/TLS** → **Overview**
- Certificate status phải là **Active**

### Bước 6: Test Domain

Sau khi SSL certificate đã được cấp:

1. **Test root domain:**
   - `https://nhatbinhkt.com`
   - Phải hiển thị website bình thường
   - Không có cảnh báo SSL

2. **Test www subdomain:**
   - `https://www.nhatbinhkt.com`
   - Phải hiển thị website bình thường

3. **Test redirect:**
   - `http://nhatbinhkt.com` → phải redirect đến `https://nhatbinhkt.com`

## Checklist:

- [ ] Đã đợi 5-15 phút để DNS propagate
- [ ] Đã kiểm tra nameservers đã propagate chưa (https://www.whatsmydns.net)
- [ ] Đã kiểm tra DNS records trên Cloudflare
- [ ] Đã thêm custom domain vào Pages
- [ ] Domain đã xuất hiện trong danh sách Custom domains
- [ ] Status đã chuyển thành "Active"
- [ ] SSL certificate đã được cấp
- [ ] Domain đã hoạt động tại `https://nhatbinhkt.com`

## Troubleshooting:

### Nameservers chưa propagate sau 1 giờ

**Kiểm tra:**
- Nameservers đã được cập nhật đúng trên Mắt Bão chưa
- Sử dụng nhiều công cụ kiểm tra:
  - https://www.whatsmydns.net
  - https://dnschecker.org
  - https://mxtoolbox.com

**Giải pháp:**
- Đợi thêm thời gian (có thể mất đến 48 giờ)
- Kiểm tra lại nameservers trên Mắt Bão

### Custom domain không được thêm vào Pages

**Nguyên nhân:**
- DNS records chưa đúng
- Nameservers chưa propagate

**Giải pháp:**
1. Kiểm tra DNS records trên Cloudflare
2. Đảm bảo nameservers đã propagate
3. Thử lại sau 15-30 phút

### SSL Certificate chưa được cấp

**Nguyên nhân:**
- DNS chưa propagate hoàn toàn
- Domain chưa được verify

**Giải pháp:**
- Đợi thêm 15-30 phút
- Kiểm tra trong Cloudflare Dashboard → SSL/TLS
- Kiểm tra DNS propagation

### Domain hoạt động nhưng hiển thị cảnh báo SSL

**Nguyên nhân:**
- SSL certificate chưa được cấp hoàn toàn

**Giải pháp:**
- Đợi thêm 15-30 phút
- Kiểm tra SSL status trong Cloudflare Dashboard

## Timeline dự kiến:

1. **0-15 phút:** DNS propagate
2. **15-30 phút:** Thêm custom domain vào Pages
3. **30-45 phút:** SSL certificate được cấp
4. **45 phút+:** Domain hoạt động hoàn toàn

## Sau khi hoàn tất:

Website sẽ hoạt động tại:
- ✅ `https://nhatbinhkt.com`
- ✅ `https://www.nhatbinhkt.com`
- ✅ Tự động redirect HTTP → HTTPS
- ✅ SSL certificate hợp lệ

