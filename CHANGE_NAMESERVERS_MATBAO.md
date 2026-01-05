# Hướng dẫn thay đổi Nameservers trên Mắt Bão

## Màn hình hiện tại:

Bạn đang ở tab **"Name Server"** và đang chọn **"Sử dụng Name Server mặc định"** (Mắt Bão).

## Các bước thay đổi:

### Bước 1: Chuyển sang Custom Nameservers

1. Click nút **"Sử dụng Name Server tùy chỉnh"** (nút có viền xanh, chữ xanh)
2. Sau khi click, sẽ hiện ra 2 ô input để nhập nameservers

### Bước 2: Nhập Nameservers của Cloudflare

Nhập vào 2 ô:

**Nameserver 1:**
```
aragorn.ns.cloudflare.com
```

**Nameserver 2:**
```
aryanna.ns.cloudflare.com
```

**Lưu ý:**
- ✅ Không có dấu chấm ở cuối
- ✅ Viết thường (không cần viết hoa)
- ✅ Không có khoảng trắng

### Bước 3: Lưu thay đổi

1. Sau khi nhập xong, nút **"Lưu thay đổi"** sẽ chuyển từ xám sang xanh
2. Click **"Lưu thay đổi"**
3. Xác nhận thay đổi (nếu có)

### Bước 4: Xóa NS record trong DNS Records (Tùy chọn)

Sau khi đã chuyển sang custom nameservers:

1. Vào tab **"Bản ghi DNS"**
2. Tìm Row 10 (Host `@`, Type `NS`)
3. Click icon **Delete** (trash can)
4. Xác nhận xóa

**Lý do:** NS record này không cần thiết khi đã dùng custom nameservers. Cloudflare sẽ tự động quản lý NS records.

## Sau khi thay đổi:

### Đợi DNS propagate:

- **Thời gian:** 5 phút đến 3 giờ (theo thông báo của Mắt Bão)
- **Có thể mất đến 24-48 giờ** trong một số trường hợp

### Kiểm tra:

1. **Kiểm tra nameservers:**
   - https://www.whatsmydns.net/#NS/nhatbinhkt.com
   - Phải hiển thị: `aragorn.ns.cloudflare.com` và `aryanna.ns.cloudflare.com`

2. **Kiểm tra DNS records:**
   - https://www.whatsmydns.net/#CNAME/nhatbinhkt.com
   - Phải trỏ đến `newsbombs.pages.dev`

### Thêm Custom Domain vào Pages:

Sau khi nameservers đã propagate:

1. Vào Cloudflare Dashboard
2. **Workers & Pages** → project `newsbombs`
3. Tab **Custom domains**
4. Click **"Set up a custom domain"**
5. Nhập: `nhatbinhkt.com`
6. Click **Continue**

## Kết quả mong đợi:

Sau khi hoàn tất:
- ✅ Nameservers đã được cập nhật thành Cloudflare
- ✅ DNS records trên Cloudflare sẽ có hiệu lực
- ✅ Custom domain có thể được thêm vào Pages
- ✅ Domain sẽ hoạt động tại `https://nhatbinhkt.com`

## Troubleshooting:

### Nút "Lưu thay đổi" vẫn xám

**Nguyên nhân:**
- Chưa nhập đủ 2 nameservers
- Nameservers không hợp lệ

**Cách sửa:**
- Kiểm tra đã nhập đủ 2 nameservers chưa
- Kiểm tra không có lỗi chính tả
- Đảm bảo không có dấu chấm ở cuối

### Nameservers không thay đổi sau 3 giờ

**Nguyên nhân:**
- DNS chưa propagate
- ISP cache

**Cách sửa:**
- Đợi thêm thời gian (có thể mất đến 48 giờ)
- Kiểm tra bằng nhiều công cụ khác nhau:
  - https://www.whatsmydns.net
  - https://dnschecker.org
  - https://mxtoolbox.com

### Domain không hoạt động sau khi thay đổi

**Nguyên nhân:**
- DNS chưa propagate hoàn toàn
- Custom domain chưa được thêm vào Pages

**Cách sửa:**
1. Kiểm tra nameservers đã propagate chưa
2. Kiểm tra DNS records trên Cloudflare
3. Thêm custom domain vào Pages
4. Đợi thêm thời gian

## Checklist:

- [ ] Đã click "Sử dụng Name Server tùy chỉnh"
- [ ] Đã nhập `aragorn.ns.cloudflare.com` vào Nameserver 1
- [ ] Đã nhập `aryanna.ns.cloudflare.com` vào Nameserver 2
- [ ] Đã click "Lưu thay đổi"
- [ ] Đã đợi 5 phút đến 3 giờ
- [ ] Đã kiểm tra nameservers đã propagate chưa
- [ ] Đã thêm custom domain vào Pages
- [ ] Domain đã hoạt động

