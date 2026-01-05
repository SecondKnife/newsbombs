# Debug POST Issue - Test Plan

## Vấn đề

Cả GET và POST đều trả về "Internal Server Error" trên Cloudflare Pages.

## Đã tạo test endpoints

### 1. `/api/test-simple` - KHÔNG dùng Edge Runtime
- GET: Test endpoint đơn giản
- POST: Test POST với Node.js runtime (mặc định)

### 2. `/api/auth/login/test` - Dùng Edge Runtime
- GET: Test Edge Runtime GET
- POST: Test Edge Runtime POST

## Cách test

### Sau khi Cloudflare Pages deploy xong (đợi 2-3 phút):

**Test 1: Simple endpoint (Node.js runtime)**
```bash
# GET
curl https://nhatbinhkt.com/api/test-simple

# POST
curl -X POST https://nhatbinhkt.com/api/test-simple \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

**Test 2: Edge Runtime endpoint**
```bash
# GET
curl https://nhatbinhkt.com/api/auth/login/test

# POST
curl -X POST https://nhatbinhkt.com/api/auth/login/test \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

## Phân tích kết quả

### Nếu `/api/test-simple` hoạt động nhưng `/api/auth/login/test` không:
- ✅ Vấn đề là với **Edge Runtime**
- Giải pháp: Cần kiểm tra Cloudflare Pages compatibility flags hoặc đổi sang Node.js runtime

### Nếu cả hai đều không hoạt động:
- ❌ Vấn đề là với **Cloudflare Pages configuration** hoặc **deployment**
- Cần kiểm tra:
  - Compatibility flags (`nodejs_compat`)
  - Environment variables
  - Build logs

### Nếu cả hai đều hoạt động:
- ✅ Vấn đề đã được fix
- Có thể là do code cũ chưa được deploy

## Gửi kết quả

Sau khi test, hãy gửi:
1. **Kết quả** từ `/api/test-simple` (GET và POST)
2. **Kết quả** từ `/api/auth/login/test` (GET và POST)
3. **Logs** từ Cloudflare Dashboard (nếu có)

Với thông tin này, tôi sẽ biết chính xác vấn đề ở đâu.

