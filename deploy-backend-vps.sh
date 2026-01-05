#!/bin/bash

# Script tự động deploy backend NestJS lên VPS
# Sử dụng: ./deploy-backend-vps.sh

set -e  # Exit on error

echo "🚀 Bắt đầu deploy backend lên VPS..."

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Biến cấu hình
VPS_IP="157.66.100.32"
VPS_USER="root"
PROJECT_DIR="/www/wwwroot/newsbombs-backend"
BACKEND_DIR="$PROJECT_DIR/backend"
DB_NAME="newsbombs"
DB_USER="postgres"
DB_PASSWORD="Tuanvip19."

echo -e "${GREEN}📋 Thông tin cấu hình:${NC}"
echo "  VPS IP: $VPS_IP"
echo "  User: $VPS_USER"
echo "  Project Dir: $PROJECT_DIR"
echo ""

# Hàm kiểm tra command có tồn tại không
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 chưa được cài đặt${NC}"
        return 1
    fi
    return 0
}

# Hàm chạy command trên VPS
run_remote() {
    ssh $VPS_USER@$VPS_IP "$1"
}

echo -e "${YELLOW}📦 Bước 1: Kiểm tra Node.js và PostgreSQL...${NC}"

# Kiểm tra Node.js
if ! run_remote "node --version" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js chưa được cài đặt. Đang cài đặt...${NC}"
    run_remote "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs"
else
    echo -e "${GREEN}✅ Node.js đã được cài đặt${NC}"
    run_remote "node --version"
fi

# Kiểm tra PostgreSQL
if ! run_remote "sudo systemctl is-active --quiet postgresql" &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL chưa được cài đặt. Đang cài đặt...${NC}"
    run_remote "sudo apt update && sudo apt install -y postgresql postgresql-contrib"
    run_remote "sudo systemctl start postgresql && sudo systemctl enable postgresql"
else
    echo -e "${GREEN}✅ PostgreSQL đã được cài đặt${NC}"
fi

# Kiểm tra PM2
if ! run_remote "pm2 --version" &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 chưa được cài đặt. Đang cài đặt...${NC}"
    run_remote "sudo npm install -g pm2"
else
    echo -e "${GREEN}✅ PM2 đã được cài đặt${NC}"
fi

echo -e "${YELLOW}📦 Bước 2: Tạo database...${NC}"

# Tạo database nếu chưa có
run_remote "sudo -u postgres psql -tc \"SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'\" | grep -q 1 || sudo -u postgres psql -c \"CREATE DATABASE $DB_NAME;\""

# Set password cho postgres user
run_remote "sudo -u postgres psql -c \"ALTER USER postgres PASSWORD '$DB_PASSWORD';\""

echo -e "${GREEN}✅ Database đã sẵn sàng${NC}"

echo -e "${YELLOW}📦 Bước 3: Tạo thư mục project...${NC}"

run_remote "sudo mkdir -p $PROJECT_DIR && sudo chown -R $VPS_USER:$VPS_USER $PROJECT_DIR"

echo -e "${GREEN}✅ Thư mục đã được tạo${NC}"

echo -e "${YELLOW}📦 Bước 4: Upload code lên VPS...${NC}"

# Tạo file tạm với backend code
echo "Đang upload code..."
cd backend
tar -czf ../backend.tar.gz .
cd ..

# Upload lên VPS
scp backend.tar.gz $VPS_USER@$VPS_IP:/tmp/

# Extract trên VPS
run_remote "cd $PROJECT_DIR && mkdir -p backend && cd backend && tar -xzf /tmp/backend.tar.gz && rm /tmp/backend.tar.gz"

# Xóa file tạm local
rm backend.tar.gz

echo -e "${GREEN}✅ Code đã được upload${NC}"

echo -e "${YELLOW}📦 Bước 5: Cấu hình environment variables...${NC}"

# Tạo file .env
run_remote "cat > $BACKEND_DIR/.env << 'EOF'
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$DB_PASSWORD
POSTGRES_DATABASE=$DB_NAME

PORT=3001
NODE_ENV=production

JWT_SECRET=$(openssl rand -hex 32)

FRONTEND_URL=https://newsbombs.pages.dev
API_URL=http://$VPS_IP:3001
EOF"

echo -e "${GREEN}✅ Environment variables đã được cấu hình${NC}"

echo -e "${YELLOW}📦 Bước 6: Cài đặt dependencies và build...${NC}"

run_remote "cd $BACKEND_DIR && npm install --production && npm run build"

echo -e "${GREEN}✅ Build thành công${NC}"

echo -e "${YELLOW}📦 Bước 7: Tạo thư mục uploads và logs...${NC}"

run_remote "mkdir -p $BACKEND_DIR/uploads $BACKEND_DIR/logs && chmod 755 $BACKEND_DIR/uploads"

echo -e "${GREEN}✅ Thư mục đã được tạo${NC}"

echo -e "${YELLOW}📦 Bước 8: Chạy database seed...${NC}"

run_remote "cd $BACKEND_DIR && npm run seed"

echo -e "${GREEN}✅ Database seed hoàn tất${NC}"

echo -e "${YELLOW}📦 Bước 9: Cấu hình PM2...${NC}"

# Tạo ecosystem.config.js
run_remote "cat > $BACKEND_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'newsbombs-backend',
      script: 'dist/main.js',
      cwd: '$BACKEND_DIR',
      node_args: '--max-old-space-size=512',
      max_memory_restart: '500M',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '$BACKEND_DIR/logs/error.log',
      out_file: '$BACKEND_DIR/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
    },
  ],
};
EOF"

echo -e "${GREEN}✅ PM2 config đã được tạo${NC}"

echo -e "${YELLOW}📦 Bước 10: Khởi động backend với PM2...${NC}"

# Stop process cũ nếu có
run_remote "pm2 delete newsbombs-backend || true"

# Start process mới
run_remote "cd $BACKEND_DIR && pm2 start ecosystem.config.js"

# Save PM2 process list
run_remote "pm2 save"

echo -e "${GREEN}✅ Backend đã được khởi động${NC}"

echo -e "${YELLOW}📦 Bước 11: Cấu hình firewall...${NC}"

run_remote "sudo ufw allow 3001/tcp || sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT || true"

echo -e "${GREEN}✅ Firewall đã được cấu hình${NC}"

echo -e "${YELLOW}📦 Bước 12: Kiểm tra backend...${NC}"

sleep 3

# Kiểm tra PM2 status
run_remote "pm2 status"

# Test API
echo "Đang test API..."
if run_remote "curl -s http://localhost:3001/api/articles" | grep -q "\[\]"; then
    echo -e "${GREEN}✅ Backend đang chạy và API hoạt động!${NC}"
else
    echo -e "${YELLOW}⚠️  Backend đang chạy nhưng cần kiểm tra logs${NC}"
    echo "Xem logs: ssh $VPS_USER@$VPS_IP 'pm2 logs newsbombs-backend'"
fi

echo ""
echo -e "${GREEN}🎉 Deploy hoàn tất!${NC}"
echo ""
echo "📋 Thông tin:"
echo "  Backend URL: http://$VPS_IP:3001"
echo "  Admin Email: admin@newsbombs.com"
echo "  Admin Password: admin123"
echo ""
echo -e "${RED}⚠️  QUAN TRỌNG: Đổi password admin ngay sau khi deploy!${NC}"
echo ""
echo "🔧 Các lệnh hữu ích:"
echo "  Xem logs: ssh $VPS_USER@$VPS_IP 'pm2 logs newsbombs-backend'"
echo "  Restart: ssh $VPS_USER@$VPS_IP 'pm2 restart newsbombs-backend'"
echo "  Status: ssh $VPS_USER@$VPS_IP 'pm2 status'"

