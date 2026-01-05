#!/bin/bash

# Script kiểm tra database đã được tạo chưa
# Chạy trên VPS

echo "🔍 Kiểm tra database..."

# Kiểm tra database
sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw newsbombs && echo "✅ Database 'newsbombs' đã tồn tại" || echo "❌ Database 'newsbombs' chưa tồn tại"

# Kiểm tra user
sudo -u postgres psql -c "\du" | grep -qw newsbombs_user && echo "✅ User 'newsbombs_user' đã tồn tại" || echo "❌ User 'newsbombs_user' chưa tồn tại"

# Test connection
echo ""
echo "🔍 Test connection với database..."
sudo -u postgres psql -d newsbombs -c "SELECT version();" && echo "✅ Kết nối database thành công!" || echo "❌ Không thể kết nối database"

