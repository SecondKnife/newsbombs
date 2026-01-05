#!/bin/bash

# Script test backend API
# Chạy trên VPS

echo "🧪 Testing Backend API..."
echo ""

# Màu sắc
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Kiểm tra PM2
echo "📋 Bước 1: Kiểm tra PM2 status..."
if pm2 list | grep -q "newsbombs-backend"; then
    echo -e "${GREEN}✅ Backend đang chạy với PM2${NC}"
    pm2 list | grep newsbombs-backend
else
    echo -e "${YELLOW}⚠️  Backend chưa chạy với PM2${NC}"
    echo "Khởi động backend..."
    cd /www/wwwroot/backend
    pm2 start ecosystem.config.js || echo "Cần tạo ecosystem.config.js trước"
fi

echo ""
echo "📋 Bước 2: Kiểm tra port 3001..."
if netstat -tlnp 2>/dev/null | grep -q ":3001" || ss -tlnp 2>/dev/null | grep -q ":3001"; then
    echo -e "${GREEN}✅ Port 3001 đang được sử dụng${NC}"
    netstat -tlnp 2>/dev/null | grep ":3001" || ss -tlnp 2>/dev/null | grep ":3001"
else
    echo -e "${RED}❌ Port 3001 không được sử dụng${NC}"
    echo "Backend có thể chưa chạy"
fi

echo ""
echo "📋 Bước 3: Test API từ localhost..."

# Test 1: Get all articles
echo ""
echo "Test 1: GET /api/articles"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost:3001/api/articles)
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Status: $HTTP_CODE${NC}"
    echo "Response: $BODY" | head -c 200
    echo "..."
else
    echo -e "${RED}❌ Status: $HTTP_CODE${NC}"
    echo "Response: $BODY"
fi

# Test 2: Health check hoặc root
echo ""
echo "Test 2: GET / (root endpoint)"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost:3001/)
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "404" ]; then
    echo -e "${GREEN}✅ Status: $HTTP_CODE (Server đang chạy)${NC}"
else
    echo -e "${RED}❌ Status: $HTTP_CODE${NC}"
fi

# Test 3: Test từ IP public
echo ""
echo "📋 Bước 4: Test API từ IP public (157.66.100.32)..."
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://157.66.100.32:3001/api/articles)
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Status: $HTTP_CODE${NC}"
    echo "Response: $BODY" | head -c 200
    echo "..."
    echo -e "${GREEN}✅ API có thể truy cập từ bên ngoài!${NC}"
else
    echo -e "${YELLOW}⚠️  Status: $HTTP_CODE${NC}"
    echo "Response: $BODY"
    echo "Có thể cần mở port 3001 trong firewall"
fi

echo ""
echo "📋 Bước 5: Xem PM2 logs (10 dòng cuối)..."
pm2 logs newsbombs-backend --lines 10 --nostream

echo ""
echo "✅ Test hoàn tất!"

