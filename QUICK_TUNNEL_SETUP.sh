#!/bin/bash

# Quick setup script for Cloudflare Tunnel
# Run this on your VPS

set -e

echo "🚀 Setting up Cloudflare Tunnel for Backend API..."

# Step 1: Install cloudflared
echo "📦 Installing cloudflared..."
if command -v apt &> /dev/null; then
    # Debian/Ubuntu
    wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
    sudo dpkg -i cloudflared-linux-amd64.deb
    rm cloudflared-linux-amd64.deb
elif command -v yum &> /dev/null; then
    # CentOS/RHEL
    wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-x86_64.rpm
    sudo rpm -i cloudflared-linux-x86_64.rpm
    rm cloudflared-linux-x86_64.rpm
else
    echo "❌ Unsupported OS. Please install cloudflared manually."
    exit 1
fi

echo "✅ cloudflared installed"

# Step 2: Login
echo "🔐 Please login to Cloudflare..."
echo "This will open a browser window. Please authorize the tunnel."
echo "If you see an error about certificate, you can download it manually:"
echo "1. Open the URL shown in browser"
echo "2. Login and download cert.pem"
echo "3. Upload to /root/.cloudflared/cert.pem"
echo ""
read -p "Press Enter after you have completed login (or if certificate is already in place)..."

# Check if certificate exists
if [ ! -f /root/.cloudflared/cert.pem ]; then
    echo "⚠️  Certificate not found. Please download and place it at /root/.cloudflared/cert.pem"
    echo "You can also try: cloudflared tunnel login"
    read -p "Press Enter when certificate is ready..."
fi

if [ -f /root/.cloudflared/cert.pem ]; then
    echo "✅ Certificate found"
else
    echo "❌ Certificate still not found. Please setup manually."
    exit 1
fi

# Step 3: Create tunnel
echo "🔨 Creating tunnel..."
TUNNEL_NAME="backend-api-$(date +%s)"
TUNNEL_OUTPUT=$(cloudflared tunnel create "$TUNNEL_NAME" 2>&1)
TUNNEL_ID=$(echo "$TUNNEL_OUTPUT" | grep -oP 'Created tunnel \K[0-9a-f-]+' || echo "")

if [ -z "$TUNNEL_ID" ]; then
    echo "❌ Failed to create tunnel. Please check the output above."
    exit 1
fi

echo "✅ Tunnel created: $TUNNEL_ID"

# Step 4: Create config
echo "📝 Creating config file..."
sudo mkdir -p /etc/cloudflared

cat > /tmp/config.yml <<EOF
tunnel: $TUNNEL_ID
credentials-file: /root/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: api.nhatbinhkt.com
    service: http://localhost:3001
  - service: http_status:404
EOF

sudo mv /tmp/config.yml /etc/cloudflared/config.yml
echo "✅ Config file created at /etc/cloudflared/config.yml"

# Step 5: Validate config
echo "🔍 Validating config..."
cloudflared tunnel --config /etc/cloudflared/config.yml validate

# Step 6: Install as service
echo "⚙️ Installing as systemd service..."
sudo cloudflared service install

# Step 7: Start service
echo "🚀 Starting cloudflared service..."
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Check status
if sudo systemctl is-active --quiet cloudflared; then
    echo "✅ cloudflared service is running"
else
    echo "❌ cloudflared service failed to start. Check logs: sudo journalctl -u cloudflared"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to Cloudflare Dashboard → DNS"
echo "2. Add CNAME record:"
echo "   - Name: api"
echo "   - Target: $TUNNEL_ID.cfargotunnel.com"
echo "   - Proxy: Proxied (orange cloud)"
echo ""
echo "3. Wait 1-2 minutes for DNS propagation"
echo ""
echo "4. Test: curl https://api.nhatbinhkt.com/api/auth/login"
echo ""
echo "5. Update Cloudflare Pages Environment Variable:"
echo "   NEXT_PUBLIC_API_URL = https://api.nhatbinhkt.com"
echo ""
echo "📝 Tunnel ID: $TUNNEL_ID"
echo "📝 Config file: /etc/cloudflared/config.yml"
echo "📝 Service logs: sudo journalctl -u cloudflared -f"

