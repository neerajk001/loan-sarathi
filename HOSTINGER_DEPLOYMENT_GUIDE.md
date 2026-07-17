# Hostinger VPS Deployment Guide - Loan Sarathi
## Complete Step-by-Step Guide for Production Deployment

**Target Environment**: Hostinger VPS  
**Deployment User**: Non-root user (recommended: `loanapp`)  
**Application**: Loan Sarathi (Frontend + Backend)

---

## Table of Contents
1. [Initial Server Setup](#step-1-initial-server-setup)
2. [Create Non-Root User](#step-2-create-non-root-user)
3. [Install Dependencies](#step-3-install-dependencies)
4. [Setup MongoDB](#step-4-setup-mongodb)
5. [Deploy Application](#step-5-deploy-application)
6. [Configure Environment Variables](#step-6-configure-environment-variables)
7. [Setup PM2 Process Manager](#step-7-setup-pm2-process-manager)
8. [Configure Nginx Reverse Proxy](#step-8-configure-nginx-reverse-proxy)
9. [Setup SSL Certificate](#step-9-setup-ssl-certificate)
10. [Configure Firewall](#step-10-configure-firewall)
11. [Final Testing](#step-11-final-testing)
12. [Monitoring & Maintenance](#step-12-monitoring--maintenance)

---

## Prerequisites

Before starting, ensure you have:
- ✅ Hostinger VPS access (root SSH credentials)
- ✅ Domain name pointed to your VPS IP
- ✅ Basic Linux knowledge
- ✅ Your application's Git repository URL (or files ready to upload)
- ✅ MongoDB connection string (Atlas or local)

---

## Step 1: Initial Server Setup

### 1.1 Connect to Your VPS

```bash
# From your Windows PowerShell
ssh root@your-vps-ip-address
# Enter your password when prompted
```

Example:
```bash
ssh root@123.456.789.0
```

### 1.2 Update System Packages

```bash
# Update package list
apt update

# Upgrade all packages
apt upgrade -y

# Install essential tools
apt install -y curl wget git build-essential software-properties-common ufw
```

### 1.3 Set Server Timezone (Optional)

```bash
# Set to your timezone (example: Asia/Kolkata)
timedatectl set-timezone Asia/Kolkata

# Verify
timedatectl
```

---

## Step 2: Create Non-Root User

### 2.1 Create New User

```bash
# Create user named 'loanapp' (you can choose any name)
adduser loanapp

# You'll be prompted to set a password
# Enter a strong password and confirm
# Press Enter to skip optional fields (Full Name, Room Number, etc.)
```

### 2.2 Grant Sudo Privileges

```bash
# Add user to sudo group
usermod -aG sudo loanapp

# Verify user was added
groups loanapp
# Output should include: loanapp : loanapp sudo
```

### 2.3 Test New User

```bash
# Switch to new user
su - loanapp

# Test sudo access (enter loanapp password when prompted)
sudo whoami
# Output should be: root

# Exit back to root for now
exit
```

### 2.4 Setup SSH Key Authentication (Recommended)

```bash
# On your Windows machine (PowerShell)
# Generate SSH key if you don't have one
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy your public key
cat ~/.ssh/id_rsa.pub | clip

# Back on VPS as root
su - loanapp
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# Paste your public key here (Ctrl+V)
# Save: Ctrl+X, Y, Enter

# Set permissions
chmod 600 ~/.ssh/authorized_keys

# Exit and test SSH key login
exit
exit

# From Windows PowerShell
ssh loanapp@your-vps-ip-address
# Should login without password
```

---

## Step 3: Install Dependencies

### 3.1 Install Node.js (v18 LTS)

```bash
# Login as loanapp user
ssh loanapp@your-vps-ip-address

# Install Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version   # Should show v18.x.x
npm --version    # Should show 9.x.x or higher
```

### 3.2 Install PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version

# Setup PM2 to start on boot
pm2 startup systemd
# Copy and run the command it outputs (starts with: sudo env PATH=...)
```

### 3.3 Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx

# Test by visiting: http://your-vps-ip-address
# You should see "Welcome to nginx!" page
```

---

## Step 4: Setup MongoDB

You have two options: Use MongoDB Atlas (Cloud) or Install MongoDB locally.

### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your VPS IP address (or 0.0.0.0/0 for all IPs)
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/loan-sarathi`)
6. Save this connection string for later

### Option B: Install MongoDB Locally

```bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/mongodb-6.gpg

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package list
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod

# Verify MongoDB is running
mongosh --eval "db.runCommand({ connectionStatus: 1 })"

# Your connection string will be: mongodb://localhost:27017/loan-sarathi
```

**Secure MongoDB (Important for local installation)**:

```bash
# Connect to MongoDB
mongosh

# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "your-strong-password-here",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

# Create application user
use loan-sarathi
db.createUser({
  user: "loanapp",
  pwd: "your-app-password-here",
  roles: [ { role: "readWrite", db: "loan-sarathi" } ]
})

# Exit
exit

# Edit MongoDB config to enable auth
sudo nano /etc/mongod.conf

# Add these lines:
security:
  authorization: enabled

# Save: Ctrl+X, Y, Enter

# Restart MongoDB
sudo systemctl restart mongod

# Your connection string will be:
# mongodb://loanapp:your-app-password-here@localhost:27017/loan-sarathi
```

---

## Step 5: Deploy Application

### 5.1 Create Application Directory

```bash
# Create directory for your app
mkdir -p ~/apps
cd ~/apps
```

### 5.2 Upload Application Files

**Option A: Using Git (Recommended)**

```bash
# Clone your repository
git clone https://github.com/your-username/your-repo.git loan-sarathi
cd loan-sarathi

# If private repo, you'll need to authenticate
# Use GitHub Personal Access Token or SSH key
```

**Option B: Using SCP (From Windows)**

```powershell
# On your Windows machine (PowerShell)
# Navigate to your project directory
cd C:\Users\Neeraj\my-app

# Copy files to VPS
scp -r * loanapp@your-vps-ip:/home/loanapp/apps/loan-sarathi/
```

**Option C: Using SFTP Client**

Use FileZilla or WinSCP to upload files:
- Host: your-vps-ip
- Username: loanapp
- Password: your-loanapp-password
- Port: 22
- Upload to: `/home/loanapp/apps/loan-sarathi/`

### 5.3 Install Dependencies

```bash
# Make sure you're in the app directory
cd ~/apps/loan-sarathi

# Install root dependencies (if any)
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## Step 6: Configure Environment Variables

### 6.1 Backend Environment Variables

```bash
cd ~/apps/loan-sarathi/backend

# Create .env file
nano .env
```

**Paste the following (adjust values):**

```bash
# MongoDB Configuration
MONGO_URI=mongodb://loanapp:your-app-password@localhost:27017/loan-sarathi
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/loan-sarathi

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Origins (your domains)
ALLOWED_ORIGINS=https://loansarathi.com,https://www.loansarathi.com,https://smartsolutionsmumbai.com,https://www.smartsolutionsmumbai.com
```

**Save**: Ctrl+X, Y, Enter

### 6.2 Frontend Environment Variables

```bash
cd ~/apps/loan-sarathi/frontend

# Create .env.local file
nano .env.local
```

**Paste the following (adjust values):**

```bash
# MongoDB Configuration
MONGO_URI=mongodb://loanapp:your-app-password@localhost:27017/loan-sarathi
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/loan-sarathi

# NextAuth Configuration
NEXTAUTH_URL=https://loansarathi.com
NEXTAUTH_SECRET=generate-a-random-secret-min-32-chars-use-command-below

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend Service URL
BACKEND_URL=http://localhost:5000

# Email Configuration (Optional - configure later)
EMAIL_ENABLED=false
EMAIL_FROM=noreply@loansarathi.com

# Public Environment Variables
NEXT_PUBLIC_BASE_URL=https://loansarathi.com
NEXT_PUBLIC_API_URL=https://loansarathi.com
```

**Save**: Ctrl+X, Y, Enter

### 6.3 Generate NEXTAUTH_SECRET

```bash
# Generate a secure random string
openssl rand -base64 32

# Copy the output and paste it as NEXTAUTH_SECRET value in .env.local
```

### 6.4 Set Correct Permissions

```bash
# Protect environment files
chmod 600 ~/apps/loan-sarathi/backend/.env
chmod 600 ~/apps/loan-sarathi/frontend/.env.local
```

---

## Step 7: Setup PM2 Process Manager

### 7.1 Build Frontend

```bash
cd ~/apps/loan-sarathi/frontend

# Build the production bundle
npm run build

# This will create an optimized production build
# Should see: "Compiled successfully" message
```

### 7.2 Test Applications Manually (Optional)

```bash
# Test backend
cd ~/apps/loan-sarathi/backend
node server.js
# Should see: "🚀 Server running on port 5000"
# Press Ctrl+C to stop

# Test frontend (in another terminal)
cd ~/apps/loan-sarathi/frontend
npm start
# Should see: "▲ Next.js ready on http://localhost:3000"
# Press Ctrl+C to stop
```

### 7.3 Start Applications with PM2

```bash
cd ~/apps/loan-sarathi

# Start both apps using ecosystem config
pm2 start ecosystem.config.js

# Check status
pm2 status

# Should see:
# ┌──────────────────────────┬────┬─────────┬──────┬───────┐
# │ Name                     │ id │ status  │ cpu  │ mem   │
# ├──────────────────────────┼────┼─────────┼──────┼───────┤
# │ loan-sarathi-backend     │ 0  │ online  │ 0%   │ 50MB  │
# │ loan-sarathi-frontend    │ 1  │ online  │ 0%   │ 150MB │
# └──────────────────────────┴────┴─────────┴──────┴───────┘
```

### 7.4 Save PM2 Configuration

```bash
# Save current PM2 processes
pm2 save

# This ensures apps restart after server reboot
```

### 7.5 Useful PM2 Commands

```bash
# View logs
pm2 logs                           # All logs
pm2 logs loan-sarathi-backend      # Backend logs only
pm2 logs loan-sarathi-frontend     # Frontend logs only

# Monitor resources
pm2 monit

# Restart apps
pm2 restart all
pm2 restart loan-sarathi-backend
pm2 restart loan-sarathi-frontend

# Stop apps
pm2 stop all
pm2 stop loan-sarathi-backend

# Delete apps from PM2
pm2 delete all
pm2 delete loan-sarathi-backend
```

---

## Step 8: Configure Nginx Reverse Proxy

### 8.1 Create Nginx Configuration

```bash
# Create new Nginx config file
sudo nano /etc/nginx/sites-available/loansarathi
```

**Paste the following configuration:**

```nginx
# Backend API Server
server {
    listen 80;
    server_name api.loansarathi.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/loansarathi-api-access.log;
    error_log /var/log/nginx/loansarathi-api-error.log;

    # Backend API proxy
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}

# Frontend Application
server {
    listen 80;
    server_name loansarathi.com www.loansarathi.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging
    access_log /var/log/nginx/loansarathi-access.log;
    error_log /var/log/nginx/loansarathi-error.log;

    # Increase body size for file uploads
    client_max_body_size 10M;

    # Frontend proxy
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Backend API routes (if using same domain)
    location /api/gallery {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files from Next.js
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}

# SmartMumbai Solutions (if using separate domain)
server {
    listen 80;
    server_name smartsolutionsmumbai.com www.smartsolutionsmumbai.com;

    # Same configuration as above
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Save**: Ctrl+X, Y, Enter

### 8.2 Enable Configuration

```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/loansarathi /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Should see:
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Reload Nginx
sudo systemctl reload nginx
```

### 8.3 Test Domain Access

```bash
# On your Windows machine, test domains
curl http://your-vps-ip

# Or visit in browser: http://your-domain.com
```

---

## Step 9: Setup SSL Certificate

### 9.1 Install Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### 9.2 Obtain SSL Certificates

```bash
# Get certificates for all domains
sudo certbot --nginx -d loansarathi.com -d www.loansarathi.com -d api.loansarathi.com -d smartsolutionsmumbai.com -d www.smartsolutionsmumbai.com

# You'll be prompted to:
# 1. Enter email address (for renewal notifications)
# 2. Agree to Terms of Service (A)
# 3. Share email with EFF (Y/N - your choice)
# 4. Choose redirect option (2 - Redirect HTTP to HTTPS)

# Certbot will automatically:
# - Obtain certificates
# - Configure Nginx
# - Setup auto-renewal
```

### 9.3 Verify Auto-Renewal

```bash
# Test certificate renewal
sudo certbot renew --dry-run

# Should see: "Congratulations, all simulated renewals succeeded"

# Check renewal timer
sudo systemctl status certbot.timer
```

### 9.4 Test HTTPS Access

Visit in browser:
- https://loansarathi.com
- https://www.loansarathi.com
- https://api.loansarathi.com
- https://smartsolutionsmumbai.com

All should show secure padlock icon 🔒

---

## Step 10: Configure Firewall

### 10.1 Setup UFW Firewall

```bash
# Check firewall status
sudo ufw status

# Allow SSH (IMPORTANT - do this first!)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Confirm: Y

# Verify rules
sudo ufw status verbose

# Should show:
# Status: active
# To                         Action      From
# --                         ------      ----
# 22/tcp                     ALLOW       Anywhere
# 80/tcp                     ALLOW       Anywhere
# 443/tcp                    ALLOW       Anywhere
```

### 10.2 Additional Security (Optional)

```bash
# Install fail2ban to prevent brute force attacks
sudo apt install -y fail2ban

# Start fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Check status
sudo fail2ban-client status
```

---

## Step 11: Final Testing

### 11.1 Test All Endpoints

```bash
# Test backend health
curl https://api.loansarathi.com/api/gallery/health
# OR
curl https://loansarathi.com/api/gallery/health

# Should return JSON with success message
```

### 11.2 Test Frontend

Visit in browser:
- https://loansarathi.com - Home page
- https://loansarathi.com/admin/signin - Admin login
- https://loansarathi.com/apply - Application form

### 11.3 Test Admin Login

1. Visit: https://loansarathi.com/admin/signin
2. Click "Sign in with Google"
3. Login with admin email
4. Should redirect to admin dashboard

### 11.4 Test File Uploads

1. Login to admin panel
2. Go to Gallery -> Create Event
3. Upload images
4. Verify images display correctly

### 11.5 Create Database Indexes

```bash
# If using local MongoDB
mongosh -u loanapp -p your-app-password loan-sarathi

# If using MongoDB Atlas
mongosh "mongodb+srv://cluster.mongodb.net/loan-sarathi" --username username

# Then run these commands:

// Loan Applications
db.loanApplications.createIndex({ applicationId: 1 }, { unique: true });
db.loanApplications.createIndex({ userEmail: 1 });
db.loanApplications.createIndex({ status: 1 });
db.loanApplications.createIndex({ createdAt: -1 });
db.loanApplications.createIndex({ source: 1, status: 1 });

// Insurance Applications
db.insuranceApplications.createIndex({ applicationId: 1 }, { unique: true });
db.insuranceApplications.createIndex({ userEmail: 1 });
db.insuranceApplications.createIndex({ status: 1 });
db.insuranceApplications.createIndex({ createdAt: -1 });

// Gallery Events
db.galleryEvents.createIndex({ source: 1, isPublished: 1, eventDate: -1 });
db.galleryEvents.createIndex({ isFeatured: 1, isPublished: 1 });
db.galleryEvents.createIndex({ eventDate: -1 });

// Admin Settings
db.adminSettings.createIndex({ _id: 1 }, { unique: true });

// Counters
db.counters.createIndex({ _id: 1 }, { unique: true });

exit
```

---

## Step 12: Monitoring & Maintenance

### 12.1 Setup Monitoring Commands

```bash
# Create monitoring script
nano ~/monitor.sh
```

**Paste:**

```bash
#!/bin/bash

echo "=== System Resources ==="
free -h
df -h /
echo ""

echo "=== PM2 Status ==="
pm2 status
echo ""

echo "=== Nginx Status ==="
sudo systemctl status nginx --no-pager
echo ""

echo "=== MongoDB Status ==="
sudo systemctl status mongod --no-pager
echo ""

echo "=== Recent Application Logs ==="
pm2 logs --lines 20 --nostream
```

**Save and make executable:**

```bash
chmod +x ~/monitor.sh

# Run it
./monitor.sh
```

### 12.2 View Logs

```bash
# PM2 logs
pm2 logs                           # Real-time all logs
pm2 logs loan-sarathi-backend --lines 100   # Last 100 backend logs
pm2 logs loan-sarathi-frontend --lines 100  # Last 100 frontend logs

# Nginx logs
sudo tail -f /var/log/nginx/loansarathi-access.log   # Access log
sudo tail -f /var/log/nginx/loansarathi-error.log    # Error log

# System logs
sudo journalctl -u nginx -f        # Nginx system logs
sudo journalctl -u mongod -f       # MongoDB logs (if local)
```

### 12.3 Common Maintenance Tasks

```bash
# Update application code (if using Git)
cd ~/apps/loan-sarathi
git pull origin main

# Backend update
cd backend
npm install
pm2 restart loan-sarathi-backend

# Frontend update
cd ../frontend
npm install
npm run build
pm2 restart loan-sarathi-frontend

# Database backup
mongodump --uri="mongodb://loanapp:password@localhost:27017/loan-sarathi" --out=/home/loanapp/backups/$(date +%Y%m%d)

# Clear PM2 logs
pm2 flush

# Monitor disk space
df -h
du -sh ~/apps/loan-sarathi/*
```

### 12.4 Setup Automated Backups (Optional)

```bash
# Create backup script
nano ~/backup.sh
```

**Paste:**

```bash
#!/bin/bash

BACKUP_DIR="/home/loanapp/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup MongoDB
echo "Backing up database..."
mongodump --uri="mongodb://loanapp:password@localhost:27017/loan-sarathi" --out=$BACKUP_DIR/mongodb_$DATE

# Backup uploaded files
echo "Backing up uploaded files..."
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz ~/apps/loan-sarathi/frontend/public/uploads

# Delete backups older than 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR"
```

**Save and schedule:**

```bash
chmod +x ~/backup.sh

# Add to crontab (run daily at 2 AM)
crontab -e

# Add this line:
0 2 * * * /home/loanapp/backup.sh >> /home/loanapp/backup.log 2>&1
```

---

## Troubleshooting Guide

### Issue 1: Application Not Starting

```bash
# Check PM2 logs
pm2 logs loan-sarathi-backend --lines 50
pm2 logs loan-sarathi-frontend --lines 50

# Common causes:
# 1. Environment variables not set
cat ~/apps/loan-sarathi/backend/.env
cat ~/apps/loan-sarathi/frontend/.env.local

# 2. MongoDB not running
sudo systemctl status mongod

# 3. Port already in use
sudo lsof -i :3000
sudo lsof -i :5000

# Kill process if needed
sudo kill -9 <PID>
```

### Issue 2: 502 Bad Gateway

```bash
# Check if applications are running
pm2 status

# Restart applications
pm2 restart all

# Check Nginx error logs
sudo tail -f /var/log/nginx/loansarathi-error.log

# Test backend directly
curl http://localhost:5000/api/gallery/health
curl http://localhost:3000
```

### Issue 3: Database Connection Failed

```bash
# Test MongoDB connection
mongosh -u loanapp -p your-password loan-sarathi

# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Issue 4: Permission Denied

```bash
# Fix file ownership
sudo chown -R loanapp:loanapp ~/apps/loan-sarathi

# Fix file permissions
chmod 755 ~/apps/loan-sarathi
chmod 600 ~/apps/loan-sarathi/backend/.env
chmod 600 ~/apps/loan-sarathi/frontend/.env.local
```

### Issue 5: SSL Certificate Issues

```bash
# Renew certificates manually
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Test SSL configuration
sudo nginx -t
```

### Issue 6: High Memory Usage

```bash
# Check memory usage
free -h

# Check PM2 memory
pm2 monit

# Restart apps to free memory
pm2 restart all

# Check for memory leaks
pm2 logs --err
```

### Issue 7: Slow Performance

```bash
# Check system resources
htop

# Check database indexes
mongosh -u loanapp -p password loan-sarathi
db.loanApplications.getIndexes()

# Enable PM2 clustering
pm2 delete all
pm2 start ecosystem.config.js --instances max
```

---

## Security Checklist

Before going live:

- [ ] All environment variables are set correctly
- [ ] No `.env` files in Git repository
- [ ] Strong passwords for all services
- [ ] Firewall is enabled and configured
- [ ] SSL certificates are installed
- [ ] MongoDB authentication is enabled
- [ ] Regular backups are configured
- [ ] Fail2ban is installed and running
- [ ] PM2 auto-restart is configured
- [ ] Domain DNS is pointing to VPS
- [ ] Google OAuth is configured with production URLs
- [ ] Admin emails are configured
- [ ] Test all application features
- [ ] Monitor logs for errors

---

## Quick Reference Commands

```bash
# Application Management
pm2 status                         # Check app status
pm2 restart all                    # Restart all apps
pm2 logs                          # View logs
pm2 monit                         # Monitor resources

# Nginx Management
sudo systemctl status nginx        # Check status
sudo systemctl restart nginx       # Restart Nginx
sudo nginx -t                     # Test configuration
sudo systemctl reload nginx        # Reload without downtime

# MongoDB Management
sudo systemctl status mongod       # Check status
sudo systemctl restart mongod      # Restart MongoDB
mongosh -u loanapp -p pass db     # Connect to database

# System Management
df -h                             # Check disk space
free -h                           # Check memory
htop                              # Resource monitor
sudo ufw status                   # Firewall status

# Logs
sudo tail -f /var/log/nginx/loansarathi-error.log
pm2 logs loan-sarathi-backend --lines 100
sudo journalctl -u nginx -f

# Backup
mongodump --uri="..." --out=~/backup
tar -czf uploads.tar.gz ~/apps/loan-sarathi/frontend/public/uploads
```

---

## Post-Deployment Configuration

### 1. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create new one)
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add Authorized redirect URIs:
   - https://loansarathi.com/api/auth/callback/google
   - https://www.loansarathi.com/api/auth/callback/google
   - https://smartsolutionsmumbai.com/api/auth/callback/google
7. Save and copy Client ID and Client Secret
8. Update in `~/apps/loan-sarathi/frontend/.env.local`
9. Restart frontend: `pm2 restart loan-sarathi-frontend`

### 2. Configure Admin Emails

```bash
# Connect to MongoDB
mongosh -u loanapp -p password loan-sarathi

# Add admin emails
db.adminSettings.updateOne(
  { _id: "main" },
  { 
    $set: { 
      "settings.adminEmails": [
        "admin@smartsolutionsmumbai.com",
        "shashichanyal@gmail.com",
        "pratik@smartsolutionsmumbai.com",
        "neerajkushwaha0401@gmail.com"
      ],
      updatedAt: new Date()
    } 
  },
  { upsert: true }
)

exit
```

### 3. Setup Email Service (Optional)

**Using Resend:**

1. Sign up at [Resend](https://resend.com/)
2. Get API key
3. Add to frontend `.env.local`:
```bash
EMAIL_ENABLED=true
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@loansarathi.com
```
4. Update `~/apps/loan-sarathi/frontend/src/lib/email.ts` as per PRODUCTION_CHECKLIST.md
5. Restart frontend

---

## Support & Resources

### Documentation
- [Production Checklist](./PRODUCTION_CHECKLIST.md)
- [Security Audit](./SECURITY_AUDIT.md)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)

### Monitoring Tools
- PM2 Plus: https://pm2.io/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Sentry: https://sentry.io/
- UptimeRobot: https://uptimerobot.com/

### Hostinger Support
- Hostinger Help Center: https://support.hostinger.com/
- VPS Tutorials: https://support.hostinger.com/en/collections/1599823-vps

---

## Conclusion

Your Loan Sarathi application is now deployed! 🎉

**What's Next:**
1. Test all features thoroughly
2. Monitor logs for any issues
3. Setup monitoring and alerts
4. Configure email service
5. Create regular backups
6. Monitor performance and optimize as needed

**Need Help?**
- Check the troubleshooting section above
- Review application logs: `pm2 logs`
- Check Nginx logs: `/var/log/nginx/`
- Check MongoDB logs: `/var/log/mongodb/`

---

**Document Version**: 1.0  
**Last Updated**: February 16, 2026  
**Author**: Deployment Guide for Hostinger VPS
