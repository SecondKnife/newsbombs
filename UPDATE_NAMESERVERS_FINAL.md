# Cập nhật Nameservers trên Mắt Bão - Hướng dẫn chi tiết

## Vấn đề:

Domain lookup vẫn hiển thị:
- `NS1.MATBAO.COM`
- `NS2.MATBAO.COM`

Thay vì nameservers của Cloudflare:
- `aragorn.ns.cloudflare.com`
- `aryanna.ns.cloudflare.com`

## Nguyên nhân:

Nameservers chưa được cập nhật trên Mắt Bão, hoặc đã cập nhật nhưng DNS chưa propagate.

## Các bước cập nhật:

### Bước 1: Đăng nhập vào Mắt Bão

1. Vào https://www.matbao.net (hoặc trang quản lý của Mắt Bão)
2. Đăng nhập tài khoản
3. Vào **Quản lý tên miền** hoặc **Domain Management**

### Bước 2: Chọn domain

1. Tìm và chọn domain `nhatbinhkt.com`
2. Click vào domain để mở chi tiết

### Bước 3: Vào phần Nameservers

Tìm một trong các tab/section sau:
- **Nameservers**
- **DNS Servers**
- **Máy chủ DNS**
- **DNS Nameservers**
- **Cài đặt DNS**

**Lưu ý:** Có thể nằm trong:
- Tab **DNS** hoặc **DNS Settings**
- Tab **Advanced** hoặc **Cài đặt nâng cao**
- Menu **Settings** hoặc **Cài đặt**

### Bước 4: Thay đổi Nameservers

1. Tìm phần hiển thị nameservers hiện tại:
   - `NS1.MATBAO.COM`
   - `NS2.MATBAO.COM`

2. Click **"Chỉnh sửa"** hoặc **"Edit"** hoặc **"Thay đổi"**

3. Chọn **"Custom Nameservers"** hoặc **"Tùy chỉnh"** (nếu có)

4. Nhập nameservers mới của Cloudflare:
   - **Nameserver 1:** `aragorn.ns.cloudflare.com`
   - **Nameserver 2:** `aryanna.ns.cloudflare.com`

5. **Xóa** hoặc **bỏ chọn** nameservers cũ:
   - `NS1.MATBAO.COM`
   - `NS2.MATBAO.COM`

6. Click **"Lưu"** hoặc **"Save"** hoặc **"Cập nhật"**

7. Xác nhận thay đổi (nếu có)

### Bước 5: Đợi DNS propagate

**Thời gian:**
- Thường mất **5-15 phút**
- Có thể mất đến **24-48 giờ** trong một số trường hợp

**Kiểm tra:**
- https://www.whatsmydns.net/#NS/nhatbinhkt.com
- Kết quả phải hiển thị:
  - `aragorn.ns.cloudflare.com`
  - `aryanna.ns.cloudflare.com`

## Troubleshooting:

### Không tìm thấy phần Nameservers

**Cách tìm:**
1. Tìm trong các tab: **DNS**, **Settings**, **Advanced**
2. Tìm trong menu: **Domain Settings**, **DNS Settings**
3. Liên hệ hỗ trợ Mắt Bão nếu không tìm thấy

### Không thể thay đổi Nameservers

**Nguyên nhân có thể:**
- Domain đang bị khóa (Domain Status: clientTransferProhibited)
- Cần unlock domain trước

**Cách sửa:**
1. Vào phần **Domain Settings** hoặc **Security**
2. Tìm **"Domain Lock"** hoặc **"Transfer Lock"**
3. Tắt lock (nếu có)
4. Thử thay đổi nameservers lại

### Nameservers đã được cập nhật nhưng lookup vẫn hiển thị cũ

**Nguyên nhân:**
- DNS chưa propagate

**Cách sửa:**
- Đợi thêm thời gian (có thể mất đến 48 giờ)
- Kiểm tra lại sau vài giờ
- Sử dụng các công cụ kiểm tra DNS khác nhau:
  - https://www.whatsmydns.net
  - https://dnschecker.org
  - https://mxtoolbox.com

## Sau khi nameservers đã được cập nhật:

1. **Kiểm tra:** https://www.whatsmydns.net/#NS/nhatbinhkt.com
2. **Đợi 5-15 phút** để DNS propagate
3. **Thêm custom domain vào Pages:**
   - Vào Cloudflare Pages → Custom domains
   - Click "Set up a custom domain"
   - Nhập: `nhatbinhkt.com`
4. **Test:** `https://nhatbinhkt.com`

## Lưu ý quan trọng:

- ✅ **Domain vẫn thuộc về bạn** - chỉ thay đổi nơi quản lý DNS
- ✅ **Có thể chuyển lại bất cứ lúc nào** - chỉ cần thay đổi nameservers lại
- ⏰ **Cần thời gian** - DNS propagate có thể mất đến 48 giờ
- 🔒 **Kiểm tra Domain Lock** - đảm bảo domain không bị khóa

