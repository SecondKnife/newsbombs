# Fix lỗi MariaDB Dependency trên VPS

## Vấn đề

Lỗi dependency khi cài đặt packages:
```
dpkg: error processing package mariadb-common (--configure)
dependency problems - leaving unconfigured
```

## Giải pháp

### Cách 1: Fix nhanh (Khuyến nghị)

Chạy các lệnh sau trên VPS:

```bash
# Fix broken packages
sudo dpkg --configure -a

# Fix dependencies
sudo apt-get install -f -y

# Clean và update
sudo apt-get clean
sudo apt-get update
sudo apt-get upgrade -y
```

### Cách 2: Nếu vẫn lỗi - Remove và reinstall

```bash
# Remove broken packages
sudo apt-get remove --purge mariadb-common mariadb-client-core-10.6 libmariadb3 mariadb-client-10.6 mariadb-client -y

# Clean cache
sudo apt-get clean
sudo apt-get autoclean
sudo apt-get autoremove -y

# Update lại
sudo apt-get update

# Fix dependencies
sudo apt-get install -f -y
```

### Cách 3: Nếu không cần MariaDB

Nếu bạn chỉ cần PostgreSQL và không cần MariaDB:

```bash
# Remove MariaDB hoàn toàn
sudo apt-get remove --purge mariadb-server mariadb-client mariadb-common -y
sudo apt-get autoremove -y
sudo apt-get autoclean -y

# Fix dependencies
sudo apt-get install -f -y
```

### Cách 4: Fix thủ công từng package

```bash
# Fix từng package một
sudo dpkg --remove --force-remove-reinstreq mariadb-common
sudo dpkg --remove --force-remove-reinstreq mariadb-client-core-10.6
sudo dpkg --remove --force-remove-reinstreq libmariadb3
sudo dpkg --remove --force-remove-reinstreq mariadb-client-10.6
sudo dpkg --remove --force-remove-reinstreq mariadb-client

# Clean và reinstall
sudo apt-get clean
sudo apt-get update
sudo apt-get install -f -y
```

## Sau khi fix

Kiểm tra lại:

```bash
# Kiểm tra packages
sudo dpkg --configure -a

# Kiểm tra dependencies
sudo apt-get check

# Nếu không có lỗi, tiếp tục cài đặt
sudo apt-get update
sudo apt-get upgrade -y
```

## Tiếp tục deploy backend

Sau khi fix xong, tiếp tục các bước deploy backend:

```bash
# Cài đặt Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Cài đặt PostgreSQL (nếu chưa có)
sudo apt install -y postgresql postgresql-contrib

# Cài đặt PM2
sudo npm install -g pm2
```

