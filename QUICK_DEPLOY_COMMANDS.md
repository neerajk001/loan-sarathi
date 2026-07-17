# Quick Deployment Command Sheet
## Hostinger VPS - Loan Sarathi Deployment

**Copy and paste these commands in sequence**

---

## 🚀 Initial Setup (As Root)

```bash
# Update system
apt update && apt upgrade -y
apt install -y curl wget git build-essential ufw

# Create user
adduser loanapp
usermod -aG sudo loanapp

# Setup timezone
timedatectl set-timezone Asia/Kolkata
```

---

## 👤 Switch to Non-Root User

```bash
su - loanapp
```

---

## 📦 Install Node.js & PM2

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Setup PM2 startup
pm2 startup systemd
# Run the command it outputs
```

---

## 🌐 Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 🗄️ Setup MongoDB (Local - Option B)

```bash
# Import key
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/mongodb-6.gpg

# Add repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install
sudo apt update
sudo apt install -y mongodb-org

# Start
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Secure MongoDB:**
```bash
mongosh
use admin
db.createUser({user:"admin",pwd:"STRONG_PASSWORD",roles:[{role:"userAdminAnyDatabase",db:"admin"}]})
use loan-sarathi
db.createUser({user:"loanapp",pwd:"APP_PASSWORD",roles:[{role:"readWrite",db:"loan-sarathi"}]})
exit

sudo nano /etc/mongod.conf
# Add: security:\n  authorization: enabled
sudo systemctl restart mongod
```

---

## 📁 Deploy Application

```bash
# Create directory
mkdir -p ~/apps
cd ~/apps

# Clone or upload your code
git clone YOUR_REPO_URL loan-sarathi
# OR upload files via SCP/SFTP to ~/apps/loan-sarathi

cd loan-sarathi

# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

---

## ⚙️ Configure Environment

**Backend (.env):**
```bash
cd ~/apps/loan-sarathi/backend
nano .env
```
Paste:
```
MONGO_URI=mongodb://loanapp:APP_PASSWORD@localhost:27017/loan-sarathi
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://loansarathi.com,https://www.loansarathi.com
```

**Frontend (.env.local):**
```bash
cd ~/apps/loan-sarathi/frontend
nano .env.local
```
Paste:
```
MONGO_URI=mongodb://loanapp:APP_PASSWORD@localhost:27017/loan-sarathi
NEXTAUTH_URL=https://loansarathi.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
BACKEND_URL=http://localhost:5000
EMAIL_ENABLED=false
EMAIL_FROM=noreply@loansarathi.com
NEXT_PUBLIC_BASE_URL=https://loansarathi.com
NEXT_PUBLIC_API_URL=https://loansarathi.com
```

**Generate secret:**
```bash
openssl rand -base64 32
```

**Set permissions:**
```bash
chmod 600 ~/apps/loan-sarathi/backend/.env
chmod 600 ~/apps/loan-sarathi/frontend/.env.local
```

---

## 🏗️ Build & Start

```bash
# Build frontend
cd ~/apps/loan-sarathi/frontend
npm run build

# Start with PM2
cd ~/apps/loan-sarathi
pm2 start ecosystem.config.js
pm2 save
pm2 status
```

---

## 🌍 Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/loansarathi
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name loansarathi.com www.loansarathi.com;
    client_max_body_size 10M;

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

    location /api/gallery {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Enable & reload:**
```bash
sudo ln -s /etc/nginx/sites-available/loansarathi /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 Setup SSL

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d loansarathi.com -d www.loansarathi.com

# Test renewal
sudo certbot renew --dry-run
```

---

## 🔥 Configure Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## 🗂️ Create Database Indexes

```bash
mongosh -u loanapp -p APP_PASSWORD loan-sarathi
```

**Run these:**
```javascript
db.loanApplications.createIndex({ applicationId: 1 }, { unique: true });
db.loanApplications.createIndex({ userEmail: 1 });
db.loanApplications.createIndex({ status: 1 });
db.loanApplications.createIndex({ createdAt: -1 });
db.insuranceApplications.createIndex({ applicationId: 1 }, { unique: true });
db.galleryEvents.createIndex({ source: 1, isPublished: 1, eventDate: -1 });
exit
```

---

## ✅ Test Everything

```bash
# Check PM2
pm2 status

# Check Nginx
sudo systemctl status nginx

# Test backend
curl http://localhost:5000/api/gallery/health

# Test frontend
curl http://localhost:3000

# Check logs
pm2 logs
```

---

## 🔍 Monitoring Commands

```bash
# View logs
pm2 logs
pm2 logs loan-sarathi-backend --lines 50
pm2 logs loan-sarathi-frontend --lines 50

# Monitor resources
pm2 monit

# Check system
free -h
df -h

# Nginx logs
sudo tail -f /var/log/nginx/loansarathi-error.log
sudo tail -f /var/log/nginx/loansarathi-access.log
```

---

## 🔄 Update Commands

```bash
# Pull latest code
cd ~/apps/loan-sarathi
git pull

# Update backend
cd backend
npm install
pm2 restart loan-sarathi-backend

# Update frontend
cd ../frontend
npm install
npm run build
pm2 restart loan-sarathi-frontend
```

---

## 💾 Backup Commands

```bash
# Backup database
mongodump --uri="mongodb://loanapp:PASSWORD@localhost:27017/loan-sarathi" --out=~/backup/$(date +%Y%m%d)

# Backup files
tar -czf ~/backup/uploads_$(date +%Y%m%d).tar.gz ~/apps/loan-sarathi/frontend/public/uploads
```

---

## 🆘 Troubleshooting

```bash
# Restart everything
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart mongod

# Check ports
sudo lsof -i :3000
sudo lsof -i :5000

# Kill process
sudo kill -9 PID

# Fix permissions
sudo chown -R loanapp:loanapp ~/apps/loan-sarathi

# Clear PM2 logs
pm2 flush

# Reset PM2
pm2 delete all
cd ~/apps/loan-sarathi
pm2 start ecosystem.config.js
pm2 save
```

---

## 📞 Important Info to Save

**VPS IP**: _________________  
**Domain**: loansarathi.com  
**SSH User**: loanapp  
**SSH Password**: _________________  
**MongoDB User**: loanapp  
**MongoDB Password**: _________________  
**NEXTAUTH_SECRET**: _________________  
**Google Client ID**: _________________  
**Google Client Secret**: _________________  

---

## 🎯 Deployment Checklist

- [ ] VPS provisioned
- [ ] Non-root user created
- [ ] Node.js installed
- [ ] PM2 installed
- [ ] Nginx installed
- [ ] MongoDB installed & secured
- [ ] Application deployed
- [ ] Environment variables configured
- [ ] Frontend built
- [ ] PM2 processes running
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Database indexes created
- [ ] Google OAuth configured
- [ ] All features tested
- [ ] Backups configured
- [ ] Monitoring setup

---

**For detailed instructions, see: HOSTINGER_DEPLOYMENT_GUIDE.md**
