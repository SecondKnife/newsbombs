#!/bin/bash

# Script fix lỗi MariaDB dependency trên Ubuntu
# Chạy trên VPS: bash fix-mariadb-dependency.sh

set -e

echo "🔧 Đang fix lỗi MariaDB dependency..."

# Fix broken packages
echo "📦 Bước 1: Fix broken packages..."
sudo dpkg --configure -a

# Fix dependencies
echo "📦 Bước 2: Fix dependencies..."
sudo apt-get install -f -y

# Nếu vẫn lỗi, thử remove và reinstall
if [ $? -ne 0 ]; then
    echo "📦 Bước 3: Remove broken MariaDB packages..."
    sudo apt-get remove --purge mariadb-common mariadb-client-core-10.6 libmariadb3 mariadb-client-10.6 mariadb-client -y || true
    
    echo "📦 Bước 4: Clean apt cache..."
    sudo apt-get clean
    sudo apt-get autoclean
    sudo apt-get update
    
    echo "📦 Bước 5: Reinstall MariaDB packages..."
    sudo apt-get install -f -y
fi

echo "✅ Hoàn tất! Kiểm tra lại:"
sudo dpkg --configure -a
sudo apt-get install -f -y

echo "✅ Đã fix xong!"

