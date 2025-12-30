# Cấu hình Cloudflare Pages cho Next.js

## Vấn đề
Next.js không chạy trực tiếp trên Cloudflare Pages mà cần adapter `@cloudflare/next-on-pages`.

## Giải pháp

### Bước 1: Cập nhật Build Command trên Cloudflare Pages

1. Vào **Cloudflare Dashboard** → **Workers & Pages** → **newsbombs**
2. Vào **Settings** → **Builds & deployments**
3. Cập nhật **Build command** thành:
   ```bash
   npm install && npm run pages:build
   ```
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
- File `wrangler.toml` đã được tạo để cấu hình output directory

## Troubleshooting

Nếu vẫn gặp lỗi:
1. Kiểm tra build log trên Cloudflare Pages
2. Đảm bảo `@cloudflare/next-on-pages` đã được cài đặt trong `devDependencies`
3. Kiểm tra xem có lỗi trong quá trình build không

