# Cấu hình Cloudflare Pages cho Next.js

## Vấn đề
Next.js không chạy trực tiếp trên Cloudflare Pages mà cần adapter `@cloudflare/next-on-pages`.

## Giải pháp

### Bước 1: Cập nhật Build Command trên Cloudflare Pages

1. Vào **Cloudflare Dashboard** → **Workers & Pages** → **newsbombs**
2. Vào **Settings** → **Builds & deployments**
3. Cập nhật **Build command** thành (chọn một trong hai):
   
   **Option 1:** Dùng script (nếu commit mới nhất có script):
   ```bash
   npm run pages:build
   ```
   
   **Option 2:** Chạy trực tiếp (nếu commit cũ không có script):
   ```bash
   npm run build && npx @cloudflare/next-on-pages
   ```
   
   **Lưu ý:** 
   - File `.npmrc` đã được tạo để tự động dùng `--legacy-peer-deps`
   - Next.js đã được downgrade xuống `15.5.2` để tương thích
   - Đảm bảo Cloudflare Pages đang theo dõi branch `main` với commit mới nhất
4. Cập nhật **Output directory** thành:
   ```
   .vercel/output/static
   ```

### Bước 2: Environment Variables (nếu cần)

Nếu bạn cần environment variables:
1. Vào **Settings** → **Environment Variables**
2. Thêm các biến cần thiết (ví dụ: `NEXT_PUBLIC_API_URL`)

### Bước 3: Deploy lại

Sau khi cập nhật build command, Cloudflare Pages sẽ tự động trigger build mới.

## Lưu ý

- Build command `pages:build` sẽ:
  1. Chạy `next build` để build Next.js
  2. Chạy `@cloudflare/next-on-pages` để convert output thành format tương thích với Cloudflare Pages
- Output sẽ được tạo trong `.vercel/output/static`
- **KHÔNG** cần file `wrangler.toml` cho Cloudflare Pages (chỉ cần cho Workers)

## Troubleshooting

### Lỗi dependency conflict (ERESOLVE)
Nếu gặp lỗi `ERESOLVE unable to resolve dependency tree`:
- Build command phải có `--legacy-peer-deps`: `npm install --legacy-peer-deps && npm run pages:build`
- Hoặc downgrade Next.js xuống `15.5.2` nếu muốn tương thích hoàn toàn

### Lỗi "unable to submit build job":
1. Đảm bảo build command đúng format: `npm install --legacy-peer-deps && npm run pages:build`
2. Đảm bảo output directory là: `.vercel/output/static`
3. Kiểm tra xem `@cloudflare/next-on-pages` đã được cài đặt trong `devDependencies`
4. Thử xóa và tạo lại project trên Cloudflare Pages

