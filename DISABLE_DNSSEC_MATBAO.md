# Hướng dẫn tắt DNSSEC trên Mắt Bão

## Vấn đề:

Thông báo lỗi: **"Tên miền đang bật DNSSEC! Không thể đổi nameserver được!"**

**Nguyên nhân:** DNSSEC đang được bật trên domain, và Mắt Bão không cho phép thay đổi nameservers khi DNSSEC đang bật.

## Giải pháp:

Cần **tắt DNSSEC** trước, sau đó mới có thể thay đổi nameservers.

## Các bước:

### Bước 1: Tìm phần DNSSEC trên Mắt Bão

1. Vào **Quản lý tên miền** → `nhatbinhkt.com`
2. Tìm một trong các tab/section sau:
   - **DNSSEC**
   - **Security** hoặc **Bảo mật**
   - **Advanced Settings** hoặc **Cài đặt nâng cao**
   - **Domain Settings** hoặc **Cài đặt tên miền**

**Lưu ý:** DNSSEC có thể nằm trong:
- Tab **Security** hoặc **Bảo mật**
- Tab **Advanced** hoặc **Nâng cao**
- Menu **Settings** hoặc **Cài đặt**

### Bước 2: Tắt DNSSEC

1. Tìm phần **DNSSEC** hoặc **DNS Security Extensions**
2. Tìm toggle/switch để tắt DNSSEC
3. **Tắt** DNSSEC (chuyển từ ON → OFF)
4. Click **"Lưu"** hoặc **"Save"**
5. Xác nhận thay đổi (nếu có)

**Lưu ý:** 
- Có thể có cảnh báo khi tắt DNSSEC - đây là bình thường
- Đợi 5-15 phút để thay đổi có hiệu lực

### Bước 3: Thay đổi Nameservers (Sau khi tắt DNSSEC)

Sau khi DNSSEC đã được tắt:

1. Vào tab **Name Server**
2. Click **"Sử dụng Name Server tùy chỉnh"**
3. Nhập nameservers của Cloudflare:
   - Nameserver 1: `aragorn.ns.cloudflare.com`
   - Nameserver 2: `aryanna.ns.cloudflare.com`
4. Click **"Lưu thay đổi"**

### Bước 4: Bật lại DNSSEC trên Cloudflare (Tùy chọn)

Sau khi đã chuyển nameservers sang Cloudflare:

1. Vào Cloudflare Dashboard
2. Chọn domain `nhatbinhkt.com`
3. Vào **SSL/TLS** → **Edge Certificates**
4. Scroll xuống tìm **DNSSEC**
5. Click **"Enable DNSSEC"** (nếu muốn bật lại)

**Lưu ý:** 
- DNSSEC trên Cloudflare sẽ tự động quản lý
- Không cần cấu hình thủ công như trên Mắt Bão

## Nếu không tìm thấy phần DNSSEC:

### Cách 1: Liên hệ hỗ trợ Mắt Bão

1. Gọi hotline hoặc chat với hỗ trợ Mắt Bão
2. Yêu cầu: "Tôi muốn tắt DNSSEC cho domain nhatbinhkt.com để có thể thay đổi nameservers"
3. Họ sẽ hỗ trợ tắt DNSSEC

### Cách 2: Tìm trong các tab khác

Thử tìm trong:
- **Domain Settings** → **Security**
- **Advanced** → **DNSSEC**
- **DNS Settings** → **DNSSEC**

## Sau khi tắt DNSSEC và thay đổi nameservers:

1. **Đợi 5-15 phút** để DNS propagate
2. **Kiểm tra:** https://www.whatsmydns.net/#NS/nhatbinhkt.com
3. **Thêm custom domain vào Pages:**
   - Vào Cloudflare Pages → Custom domains
   - Click "Set up a custom domain"
   - Nhập: `nhatbinhkt.com`

## Lưu ý quan trọng:

- ⚠️ **Tắt DNSSEC tạm thời** - chỉ để thay đổi nameservers
- ✅ **Có thể bật lại** trên Cloudflare sau khi đã chuyển nameservers
- ⏰ **Cần thời gian** - đợi 5-15 phút sau khi tắt DNSSEC
- 🔒 **Bảo mật** - DNSSEC giúp bảo vệ DNS, nên bật lại sau khi chuyển sang Cloudflare

## Troubleshooting:

### Không tìm thấy phần DNSSEC

- Liên hệ hỗ trợ Mắt Bão
- Họ có thể tắt DNSSEC từ phía backend

### Vẫn không thể thay đổi nameservers sau khi tắt DNSSEC

- Đợi thêm 15-30 phút
- Kiểm tra DNSSEC đã thực sự tắt chưa
- Thử refresh trang và thử lại

### Muốn giữ DNSSEC

- Có thể giữ DNS ở Mắt Bão và chỉ cấu hình DNS records
- Nhưng Cloudflare Pages thường yêu cầu DNS ở Cloudflare
- Nên tắt DNSSEC tạm thời, chuyển nameservers, rồi bật lại trên Cloudflare

