#!/bin/bash
# Script chuẩn bị code để deploy lên Cloudflare Pages
# Chạy trên máy local: bash cloudflare-pages-setup.sh

echo "=========================================="
echo "Chuẩn bị Deploy lên Cloudflare Pages"
echo "=========================================="
echo ""

# Kiểm tra Git
if ! command -v git &> /dev/null; then
    echo "❌ Git chưa được cài đặt!"
    exit 1
fi

echo "1. Kiểm tra Git repository..."
if [ ! -d ".git" ]; then
    echo "⚠️  Không phải Git repository"
    read -p "Bạn có muốn khởi tạo Git repository? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git init
        git add .
        git commit -m "Initial commit"
        echo "✅ Đã khởi tạo Git repository"
    else
        echo "❌ Cần Git repository để deploy lên Cloudflare Pages"
        exit 1
    fi
fi

# Kiểm tra .gitignore
echo ""
echo "2. Kiểm tra .gitignore..."
if ! grep -q ".env.local" .gitignore 2>/dev/null; then
    echo "⚠️  .env.local chưa có trong .gitignore"
    echo ".env.local" >> .gitignore
    echo ".env*.local" >> .gitignore
    echo "✅ Đã thêm .env.local vào .gitignore"
else
    echo "✅ .gitignore đã đúng"
fi

# Tạo file .env.production.example
echo ""
echo "3. Tạo file .env.production.example..."
cat > .env.production.example << 'EOF'
# Production Environment Variables for Cloudflare Pages
# Set these in Cloudflare Pages Dashboard → Settings → Environment Variables

# Backend API URL (VPS)
NEXT_PUBLIC_API_URL=http://157.66.100.32

# Or if you have a domain for backend:
# NEXT_PUBLIC_API_URL=http://api.nhatbinhkt.com
EOF
echo "✅ Đã tạo .env.production.example"

# Kiểm tra next.config.mjs
echo ""
echo "4. Kiểm tra next.config.mjs..."
if [ -f "next.config.mjs" ]; then
    echo "✅ next.config.mjs đã tồn tại"
else
    echo "⚠️  Không tìm thấy next.config.mjs"
fi

# Tạo file README cho Cloudflare
echo ""
echo "5. Tạo file README-CLOUDFLARE.md..."
cat > README-CLOUDFLARE.md << 'EOF'
# Deploy lên Cloudflare Pages

## Environment Variables cần set trong Cloudflare Pages:

1. Vào Cloudflare Dashboard → Workers & Pages → Your Project → Settings → Environment Variables
2. Thêm:
   - **Variable name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `http://157.66.100.32` (hoặc domain backend của bạn)
   - **Environment:** Production, Preview, Development

## Build Settings:

- **Framework preset:** Next.js
- **Build command:** `npm run build`
- **Build output directory:** `.next`

## Custom Domain:

1. Vào Settings → Custom domains
2. Thêm domain của bạn
3. Cấu hình DNS theo hướng dẫn

## CORS:

Đảm bảo backend CORS config có domain Cloudflare Pages:
- `https://your-project.pages.dev`
- Custom domain của bạn (nếu có)
EOF
echo "✅ Đã tạo README-CLOUDFLARE.md"

echo ""
echo "=========================================="
echo "✅ Hoàn tất!"
echo "=========================================="
echo ""
echo "Bước tiếp theo:"
echo "1. Commit và push code lên Git:"
echo "   git add ."
echo "   git commit -m 'Prepare for Cloudflare Pages'"
echo "   git push"
echo ""
echo "2. Vào Cloudflare Dashboard:"
echo "   https://dash.cloudflare.com"
echo ""
echo "3. Workers & Pages → Pages → Create a project"
echo ""
echo "4. Connect Git repository và deploy"
echo ""
echo "5. Set environment variable NEXT_PUBLIC_API_URL"
echo ""

