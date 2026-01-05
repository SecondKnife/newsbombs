#!/bin/bash

# Script fix PostgreSQL authentication - từng bước rõ ràng

echo "🔍 Bước 1: Tìm file pg_hba.conf..."

# Tìm file pg_hba.conf
PG_HBA_FILE=$(sudo find /etc -name pg_hba.conf 2>/dev/null | head -1)

if [ -z "$PG_HBA_FILE" ]; then
    echo "❌ Không tìm thấy file pg_hba.conf"
    echo "Kiểm tra PostgreSQL đã được cài đặt chưa:"
    sudo systemctl status postgresql
    exit 1
fi

echo "✅ Tìm thấy: $PG_HBA_FILE"

echo ""
echo "🔍 Bước 2: Backup file..."
sudo cp "$PG_HBA_FILE" "${PG_HBA_FILE}.backup.$(date +%s)"
echo "✅ Đã backup"

echo ""
echo "🔍 Bước 3: Xem nội dung hiện tại..."
echo "---"
sudo grep -E "(local|host).*postgres" "$PG_HBA_FILE" || echo "Không tìm thấy dòng postgres"
echo "---"

echo ""
echo "🔍 Bước 4: Sửa file..."
# Sửa dòng local postgres từ peer sang md5
sudo sed -i 's/local\s\+all\s\+postgres\s\+peer/local   all             postgres                                md5/' "$PG_HBA_FILE"

# Thêm dòng host nếu chưa có
if ! sudo grep -q "host.*all.*all.*127.0.0.1/32.*md5" "$PG_HBA_FILE"; then
    echo "host    all             all             127.0.0.1/32            md5" | sudo tee -a "$PG_HBA_FILE"
    echo "✅ Đã thêm dòng host authentication"
fi

echo "✅ Đã sửa file"

echo ""
echo "🔍 Bước 5: Xem nội dung sau khi sửa..."
echo "---"
sudo grep -E "(local|host).*postgres|host.*all.*all.*127.0.0.1" "$PG_HBA_FILE"
echo "---"

echo ""
echo "🔍 Bước 6: Set password cho postgres user..."
sudo -u postgres psql << EOF
ALTER USER postgres WITH PASSWORD 'Tuanvip19.';
\q
EOF
echo "✅ Đã set password"

echo ""
echo "🔍 Bước 7: Restart PostgreSQL..."
sudo systemctl restart postgresql
sleep 2

if sudo systemctl is-active --quiet postgresql; then
    echo "✅ PostgreSQL đã restart"
else
    echo "❌ PostgreSQL không chạy"
    sudo systemctl status postgresql
    exit 1
fi

echo ""
echo "🔍 Bước 8: Test connection..."
if PGPASSWORD='Tuanvip19.' psql -h localhost -U postgres -d newsbombs -c "SELECT 1;" &> /dev/null; then
    echo "✅ Connection thành công!"
else
    echo "❌ Vẫn không thể connect"
    echo "Kiểm tra lại:"
    PGPASSWORD='Tuanvip19.' psql -h localhost -U postgres -d newsbombs -c "SELECT 1;"
    exit 1
fi

echo ""
echo "✅ Hoàn tất!"

