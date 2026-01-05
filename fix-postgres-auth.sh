#!/bin/bash

# Script fix PostgreSQL authentication
# Chạy trên VPS

set -e

echo "🔧 Đang fix PostgreSQL authentication..."

# Bước 1: Kiểm tra có thể connect không cần password không
echo "📋 Bước 1: Kiểm tra connection..."
if sudo -u postgres psql -c "SELECT 1;" &> /dev/null; then
    echo "✅ Có thể connect không cần password (peer auth)"
    
    # Set password cho postgres user
    echo "📋 Bước 2: Set password cho postgres user..."
    sudo -u postgres psql << EOF
ALTER USER postgres WITH PASSWORD 'Tuanvip19.';
\q
EOF
    echo "✅ Đã set password"
else
    echo "❌ Không thể connect, cần kiểm tra PostgreSQL"
    exit 1
fi

# Bước 3: Tìm file pg_hba.conf
echo "📋 Bước 3: Tìm file pg_hba.conf..."
PG_HBA_FILE=$(sudo find /etc -name pg_hba.conf 2>/dev/null | head -1)

if [ -z "$PG_HBA_FILE" ]; then
    echo "❌ Không tìm thấy pg_hba.conf"
    exit 1
fi

echo "✅ Tìm thấy: $PG_HBA_FILE"

# Backup file
echo "📋 Bước 4: Backup file config..."
sudo cp "$PG_HBA_FILE" "${PG_HBA_FILE}.backup.$(date +%s)"
echo "✅ Đã backup"

# Bước 5: Sửa file pg_hba.conf
echo "📋 Bước 5: Cấu hình authentication..."

# Tạo file tạm với config mới
sudo sed -i 's/local\s\+all\s\+postgres\s\+peer/local   all             postgres                                md5/' "$PG_HBA_FILE"

# Thêm dòng host nếu chưa có
if ! grep -q "host.*all.*all.*127.0.0.1/32.*md5" "$PG_HBA_FILE"; then
    echo "host    all             all             127.0.0.1/32            md5" | sudo tee -a "$PG_HBA_FILE"
fi

echo "✅ Đã cấu hình authentication"

# Bước 6: Restart PostgreSQL
echo "📋 Bước 6: Restart PostgreSQL..."
sudo systemctl restart postgresql
sleep 2

# Kiểm tra PostgreSQL đang chạy
if sudo systemctl is-active --quiet postgresql; then
    echo "✅ PostgreSQL đã restart"
else
    echo "❌ PostgreSQL không chạy, kiểm tra logs:"
    sudo systemctl status postgresql
    exit 1
fi

# Bước 7: Test connection với password
echo "📋 Bước 7: Test connection với password..."
if PGPASSWORD='Tuanvip19.' psql -h localhost -U postgres -d newsbombs -c "SELECT 1;" &> /dev/null; then
    echo "✅ Connection thành công với password!"
else
    echo "❌ Vẫn không thể connect với password"
    echo "Kiểm tra lại file pg_hba.conf:"
    sudo cat "$PG_HBA_FILE" | grep -E "(local|host).*postgres"
    exit 1
fi

echo ""
echo "✅ Hoàn tất! PostgreSQL đã được cấu hình để dùng password authentication"
echo ""
echo "Test lại:"
echo "  PGPASSWORD='Tuanvip19.' psql -h localhost -U postgres -d newsbombs -c \"SELECT 1;\""

