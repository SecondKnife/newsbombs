# Cloudflare Root Domain Record - Giải thích

## Vấn đề:

Khi bạn nhập `@` hoặc để trống Name field, Cloudflare tự động hiển thị tên domain đầy đủ (`nhatbinhkt.com`) trong giao diện. Đây là **hành vi bình thường** của Cloudflare.

## Giải thích:

Trong Cloudflare:
- **Name = `@`** hoặc **Name = để trống** → Cloudflare hiển thị là `nhatbinhkt.com` trong giao diện
- **Name = `nhatbinhkt.com`** (không có subdomain) → Cũng là root domain record
- **Cả hai đều đại diện cho root domain** (`@`)

## Cách kiểm tra record có đúng không:

### Record đúng (Root domain):
- Name: `nhatbinhkt.com` (không có subdomain phía trước)
- Type: `CNAME`
- Content: `newsbombs.pages.dev`
- Proxy status: `Proxied` (orange cloud)

### Record sai:
- Name: `www.nhatbinhkt.com` hoặc có subdomain khác
- Type: Khác `CNAME` (trừ khi cần A record)

## Nếu record hiện tại đã đúng:

**Bạn có thể giữ nguyên** nếu:
- ✅ Name là `nhatbinhkt.com` (không có subdomain)
- ✅ Type là `CNAME`
- ✅ Content là `newsbombs.pages.dev`
- ✅ Proxy status là `Proxied`

## Nếu muốn tạo lại record:

### Cách 1: Xóa và tạo lại

1. **Xóa record hiện tại:**
   - Click **"Edit"** ở Row 1
   - Click **"Delete"** hoặc chọn record và xóa

2. **Tạo record mới:**
   - Click **"+ Add record"**
   - **Type:** `CNAME`
   - **Name:** Để **trống** (không nhập gì)
   - **Target:** `newsbombs.pages.dev`
   - **Proxy status:** Bật (Proxied - orange cloud)
   - **TTL:** Auto
   - Click **"Save"**

3. **Kết quả:**
   - Cloudflare sẽ tự động điền Name là `nhatbinhkt.com`
   - Đây là root domain record, đúng rồi!

### Cách 2: Giữ nguyên (Nếu đã đúng)

Nếu record hiện tại:
- Name: `nhatbinhkt.com` (không có subdomain)
- Type: `CNAME`
- Content: `newsbombs.pages.dev`
- Proxy: Proxied

→ **Giữ nguyên**, không cần sửa!

## Quan trọng:

**Record với Name = `nhatbinhkt.com` (không có subdomain) = Root domain record = `@`**

Cloudflare chỉ hiển thị khác nhau trong giao diện, nhưng cả hai đều đại diện cho root domain.

## Các bước tiếp theo:

1. ✅ **Kiểm tra Row 1:** Nếu Name là `nhatbinhkt.com` (không có subdomain) → Đúng rồi, giữ nguyên
2. ❌ **Xóa Row 3 & 4:** NS records của Mắt Bão
3. ✅ **Kiểm tra Custom Domain:** Vào Pages → Custom domains → thêm `nhatbinhkt.com`

## Test:

Sau khi hoàn tất:
- Đợi 5-15 phút
- Test: `https://nhatbinhkt.com` và `https://www.nhatbinhkt.com`

