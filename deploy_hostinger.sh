#!/bin/bash

# ==============================================================================
# UPHA DEPLOYMENT SCRIPT FOR HOSTINGER VPS (UBUNTU)
# Domain: upha.in
# Git Repo: https://github.com/hg9336099029/UPHA
# ==============================================================================
# WARNING: Run this script as root (sudo ./deploy_hostinger.sh)
# ==============================================================================

set -e

DOMAIN="upha.in"
REPO_URL="https://github.com/hg9336099029/UPHA"
PROJECT_DIR="/var/www/upha"
DB_NAME="upha_db"
DB_USER="upha_user"
# Generate a random password for the database and Django secret key
DB_PASS=$(openssl rand -base64 12)
DJANGO_SECRET=$(openssl rand -base64 32)

echo "Starting UPHA Deployment Script..."
sleep 2

# 1. System Updates & Dependencies
echo "--> Updating system and installing dependencies..."
apt update && apt upgrade -y
apt install -y curl git python3-pip python3-venv postgresql postgresql-contrib nginx certbot python3-certbot-nginx libpq-dev

# 2. Install Node.js & PM2
echo "--> Installing Node.js (v20) and PM2..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2
pm2 startup systemd -u root --hp /root || true

# 3. Database Setup (PostgreSQL)
echo "--> Setting up PostgreSQL database..."
# Run postgres commands as the postgres user
sudo -i -u postgres psql -c "CREATE DATABASE ${DB_NAME};" || echo "Database already exists"
sudo -i -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';" || echo "User already exists"
sudo -i -u postgres psql -c "ALTER ROLE ${DB_USER} SET client_encoding TO 'utf8';"
sudo -i -u postgres psql -c "ALTER ROLE ${DB_USER} SET default_transaction_isolation TO 'read committed';"
sudo -i -u postgres psql -c "ALTER ROLE ${DB_USER} SET timezone TO 'UTC';"
sudo -i -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
sudo -i -u postgres psql -c "ALTER DATABASE ${DB_NAME} OWNER TO ${DB_USER};"

# 4. Clone Repository
echo "--> Setting up Project Directory..."
mkdir -p /var/www
if [ -d "$PROJECT_DIR" ]; then
    echo "Directory exists. Pulling latest changes..."
    cd $PROJECT_DIR
    git pull origin main || git pull origin master
else
    echo "Cloning repository..."
    git clone $REPO_URL $PROJECT_DIR
    cd $PROJECT_DIR
fi

# 5. Backend Setup (Django)
echo "--> Setting up Django Backend..."
cd $PROJECT_DIR/backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn psycopg2-binary dj-database-url

# Create backend .env file
cat <<EOF > .env
DEBUG=False
SECRET_KEY=${DJANGO_SECRET}
DATABASE_URL=postgres://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}
FRONTEND_URL=https://${DOMAIN}
BACKEND_URL=https://${DOMAIN}
EOF

python manage.py migrate
python manage.py collectstatic --noinput
deactivate

# Create Gunicorn systemd service
echo "--> Configuring Gunicorn Systemd Service..."
cat <<EOF > /etc/systemd/system/upha.service
[Unit]
Description=gunicorn daemon for UPHA Backend
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=${PROJECT_DIR}/backend
ExecStart=${PROJECT_DIR}/backend/venv/bin/gunicorn --access-logfile - --workers 3 --bind 127.0.0.1:8000 upha_be.wsgi:application

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl start upha
systemctl enable upha

# 6. Frontend Setup (Next.js)
echo "--> Setting up Next.js Frontend..."
cd $PROJECT_DIR/frontend
# Create frontend .env.production file
cat <<EOF > .env.production
NEXT_PUBLIC_API_URL=https://${DOMAIN}/api
EOF

npm install
npm run build

# Start with PM2
echo "--> Starting Frontend with PM2..."
pm2 delete upha-frontend || true
pm2 start npm --name "upha-frontend" -- start
pm2 save

# 7. Nginx Setup
echo "--> Configuring Nginx Reverse Proxy..."
cat <<EOF > /etc/nginx/sites-available/upha
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    # Serve static files from Django
    location /static/ {
        alias ${PROJECT_DIR}/backend/staticfiles/;
    }

    # Serve media files from Django
    location /media/ {
        alias ${PROJECT_DIR}/backend/media/;
    }

    # Route /api to Django Backend
    location /api/ {
        # Rewrite the /api to / if your django URLs don't expect it,
        # but usually you just pass it through. Assuming django expects /api/... or handles it
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Route Django Admin to Backend
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Route all other traffic to Next.js Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/upha /etc/nginx/sites-enabled/
# Remove default nginx site if exists
rm -f /etc/nginx/sites-enabled/default
# Test and restart Nginx
nginx -t
systemctl restart nginx

# 8. Finished! Provide next steps
echo "=========================================================================="
echo "Deployment Script Completed Successfully!"
echo ""
echo "Database User: ${DB_USER}"
echo "Database Pass: ${DB_PASS}"
echo ""
echo "IMPORTANT NEXT STEPS:"
echo "1. Ensure your domain (${DOMAIN}) DNS A Record points to this server's IP address."
echo "2. Once DNS is propagated, secure your site with HTTPS by running:"
echo "   sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo "=========================================================================="
