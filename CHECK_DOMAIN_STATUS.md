# Cách kiểm tra domain nhatbinhkt.com đã hoạt động chưa

## Các bước kiểm tra:

### 1. Kiểm tra DNS Propagation

Truy cập: https://www.whatsmydns.net/#NS/nhatbinhkt.com

**Kết quả mong đợi:**
- Nameservers phải là: `aragorn.ns.cloudflare.com` và `aryanna.ns.cloudflare.com`
- Nếu vẫn thấy `ns1.matbao.com` và `ns2.matbao.com` → DNS chưa propagate (đợi thêm)

### 2. Kiểm tra DNS Records

Truy cập: https://www.whatsmydns.net/#CNAME/nhatbinhkt.com

**Kết quả mong đợi:**
- Phải trỏ đến `newsbombs.pages.dev` hoặc IP Cloudflare

### 3. Test truy cập domain

Mở trình duyệt và truy cập:
- `https://nhatbinhkt.com`
- `https://www.nhatbinhkt.com`

**Kết quả:**
- ✅ **Hoạt động:** Website hiển thị bình thường
- ⚠️ **SSL Error:** Đợi thêm 5-15 phút để SSL certificate được cấp
- ❌ **Không truy cập được:** Kiểm tra các bước dưới

## Các trường hợp có thể xảy ra:

### Trường hợp 1: Domain chưa hoạt động

**Nguyên nhân có thể:**
1. Nameservers chưa được cập nhật trên Mắt Bão
2. DNS chưa propagate (cần đợi 5-15 phút hoặc 24-48 giờ)
3. Custom domain chưa được thêm vào Cloudflare Pages

**Cách sửa:**
1. Kiểm tra nameservers trên Mắt Bão đã đúng chưa
2. Đợi thêm thời gian để DNS propagate
3. Vào Cloudflare Pages → Custom domains → thêm `nhatbinhkt.com`

### Trường hợp 2: SSL Certificate Error

**Nguyên nhân:**
- SSL certificate chưa được cấp (cần 5-15 phút)

**Cách sửa:**
- Đợi thêm 5-15 phút
- Kiểm tra trong Cloudflare Dashboard → SSL/TLS → Overview

### Trường hợp 3: 404 Not Found

**Nguyên nhân:**
- Custom domain chưa được thêm vào Cloudflare Pages

**Cách sửa:**
1. Vào Cloudflare Dashboard
2. **Workers & Pages** → project `newsbombs`
3. Tab **Custom domains**
4. Click **Set up a custom domain**
5. Nhập: `nhatbinhkt.com`
6. Click **Continue**

## Checklist để domain hoạt động:

- [ ] Nameservers đã được cập nhật trên Mắt Bão
- [ ] DNS records đã được cấu hình trên Cloudflare
- [ ] Custom domain đã được thêm vào Cloudflare Pages
- [ ] Đã đợi 5-15 phút để DNS propagate
- [ ] SSL certificate đã được cấp (kiểm tra trong Cloudflare Dashboard)

## Kiểm tra nhanh:

1. **DNS Propagation:** https://www.whatsmydns.net/#NS/nhatbinhkt.com
2. **SSL Check:** https://www.ssllabs.com/ssltest/analyze.html?d=nhatbinhkt.com
3. **Website Status:** Mở trình duyệt → `https://nhatbinhkt.com`

## Nếu vẫn không hoạt động:

1. Kiểm tra lại tất cả các bước trong `UPDATE_NAMESERVERS_MATBAO.md`
2. Kiểm tra trong Cloudflare Dashboard → **Custom domains** → xem status
3. Kiểm tra DNS records trong Cloudflare Dashboard → **DNS** → xem có đúng không
4. Đợi thêm thời gian (có thể mất đến 48 giờ)

