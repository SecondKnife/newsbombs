# Hướng dẫn cập nhật Nameservers trên Mắt Bão

## Bước 1: Copy Nameservers từ Cloudflare

Từ màn hình Cloudflare, bạn có 2 nameservers:
- `aragorn.ns.cloudflare.com`
- `aryanna.ns.cloudflare.com`

Click "Click to copy" để copy từng nameserver.

## Bước 2: Đăng nhập vào Mắt Bão

1. Vào https://www.matbao.net (hoặc trang quản lý của Mắt Bão)
2. Đăng nhập tài khoản
3. Vào **Quản lý tên miền** hoặc **Domain Management**
4. Tìm và chọn domain `nhatbinhkt.com`

## Bước 3: Vào phần Nameservers

1. Tìm tab **Nameservers** hoặc **DNS Servers** hoặc **Máy chủ DNS**
2. Click vào để chỉnh sửa

## Bước 4: Thay đổi Nameservers

### Xóa nameservers cũ:
- Xóa: `ns1.matbao.com`
- Xóa: `ns2.matbao.com`

### Thêm nameservers mới của Cloudflare:
- Nameserver 1: `aragorn.ns.cloudflare.com`
- Nameserver 2: `aryanna.ns.cloudflare.com`

**Lưu ý:** Một số giao diện Mắt Bão có thể yêu cầu:
- Chọn "Custom Nameservers" hoặc "Tùy chỉnh"
- Nhập từng nameserver vào các ô tương ứng

## Bước 5: Lưu thay đổi

1. Click **Lưu** hoặc **Save** hoặc **Cập nhật**
2. Xác nhận thay đổi (nếu có)

## Bước 6: Quay lại Cloudflare

1. Quay lại màn hình Cloudflare
2. Click **"Continue"**
3. Cloudflare sẽ kiểm tra nameservers

## Bước 7: Đợi DNS propagate

- Thường mất **5-15 phút**
- Có thể mất đến **24-48 giờ** trong một số trường hợp
- Kiểm tra: https://www.whatsmydns.net/#NS/nhatbinhkt.com

## Sau khi nameservers đã được cập nhật

1. Cloudflare sẽ tự động quản lý DNS
2. SSL certificate sẽ được cấp tự động (5-15 phút)
3. Bạn có thể thêm custom domain vào Pages:
   - Vào **Workers & Pages** → project `newsbombs`
   - Vào **Custom domains**
   - Click **Set up a custom domain**
   - Nhập: `nhatbinhkt.com`

## Lưu ý quan trọng

✅ **Domain vẫn thuộc về bạn** - chỉ thay đổi nơi quản lý DNS
✅ **Có thể chuyển lại bất cứ lúc nào** - chỉ cần thay đổi nameservers lại
✅ **Thường không gây downtime** - như Cloudflare đã nói
✅ **Bảo mật tốt hơn** - Cloudflare cung cấp DDoS protection và CDN

## Troubleshooting

### Nameservers không hoạt động sau 24 giờ

1. Kiểm tra nameservers đã được cập nhật đúng chưa
2. Kiểm tra DNS propagation: https://www.whatsmydns.net
3. Đảm bảo đã xóa nameservers cũ
4. Liên hệ Mắt Bão nếu cần hỗ trợ

### Không tìm thấy phần Nameservers trên Mắt Bão

- Tìm các tab: **DNS**, **DNS Servers**, **Máy chủ DNS**, **Nameservers**
- Có thể nằm trong **Cài đặt nâng cao** hoặc **Advanced Settings**
- Liên hệ hỗ trợ Mắt Bão nếu không tìm thấy

