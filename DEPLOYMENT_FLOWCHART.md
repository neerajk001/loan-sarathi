# Deployment Flowchart - Loan Sarathi on Hostinger VPS

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    HOSTINGER VPS DEPLOYMENT FLOW                        │
│                         Step-by-Step Process                            │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: INITIAL VPS SETUP (As Root)                          ~15 mins  │
└──────────────────────────────────────────────────────────────────────────┘
    │
    ├─► 1.1 Connect to VPS
    │   ssh root@your-vps-ip
    │
    ├─► 1.2 Update System
    │   apt update && apt upgrade -y
    │
    ├─► 1.3 Install Essential Tools
    │   apt install -y curl wget git build-essential ufw
    │
    └─► 1.4 Set Timezone
        timedatectl set-timezone Asia/Kolkata

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: CREATE NON-ROOT USER                                 ~5 mins   │
└──────────────────────────────────────────────────────────────────────────┘
    │
    ├─► 2.1 Create User 'loanapp'
    │   adduser loanapp
    │
    ├─► 2.2 Grant Sudo Privileges
    │   usermod -aG sudo loanapp
    │
    ├─► 2.3 Setup SSH Keys (Optional)
    │   mkdir -p ~/.ssh
    │   nano ~/.ssh/authorized_keys
    │
    └─► 2.4 Switch to New User
        su - loanapp

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: INSTALL DEPENDENCIES (As loanapp)                    ~10 mins  │
└──────────────────────────────────────────────────────────────────────────┘
    │
    ├─► 3.1 Install Node.js 18.x
    │   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    │   sudo apt install -y nodejs
    │   node --version  (verify)
    │
    ├─► 3.2 Install PM2 (Process Manager)
    │   sudo npm install -g pm2
    │   pm2 startup systemd  (then run the command it outputs)
    │
    └─► 3.3 Install Nginx (Web Server)
        sudo apt install -y nginx
        sudo systemctl start nginx
        sudo systemctl enable nginx

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: SETUP DATABASE                                       ~15 mins  │
└──────────────────────────────────────────────────────────────────────────┘
    │
    ├─► Option A: MongoDB Atlas (Cloud) - RECOMMENDED
    │   • Go to mongodb.com/cloud/atlas
    │   • Create free cluster
    │   • Get connection string
    │   • Whitelist VPS IP
    │
    └─► Option B: Local MongoDB Installation
        • Install MongoDB 6.0
        • Create database users
        • Enable authentication
        • Connection: mongodb://loanapp:pass@localhost:27017/loan-sarathi

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 5: DEPLOY APPLICATION                                   ~20 mins  │
└──────────────────────────────────────────────────────────────────────────┘
    │
    ├─► 5.1 Create App Directory
    │   mkdir -p ~/apps && cd ~/apps
    │
    ├─► 5.2 Upload/Clone Application
    │   • Git Clone: git clone <repo-url> loan-sarathi
    │   • OR SCP: scp -r * loanapp@ip:/home/loanapp/apps/loan-sarathi/
    │   • OR SFTP: Use FileZilla/WinSCP
    │
    ├─► 5.3 Install Dependencies
    │   cd ~/apps/loan-sarathi
    │   npm install
    │   cd backend && npm install && cd ..
    │   cd frontend && npm install && cd ..
    │
    ├─► 5.4 Configure Backend Environment
    │   cd backend
    │   nano .env
    │   • MONGO_URI=...
    │   • PORT=5000
    │   • NODE_ENV=production
    │   • ALLOWED_ORIGINS=https://loansarathi.com,...
    │   chmod 600 .env
    │
    ├─► 5.5 Configure Frontend Environment
    │   cd ../frontend
    │   nano .env.local
    │   • MONGO_URI=...
    │   • NEXTAUTH_URL=https://loansarathi.com
    │   • NEXTAUTH_SECRET=$(openssl rand -base64 32)
    │   • GOOGLE_CLIENT_ID=...
    │   • GOOGLE_CLIENT_SECRET=...
    │   • BACKEND_URL=http://localhost:5000
    │   chmod 600 .env.local
    │
    └─► 5.6 Build Frontend
        npm run build  (takes 2-5 minutes)

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 6: START APPLICATIONS WITH PM2                          ~5 mins   │
└──────────────────────────────────────────────────────────────────────────┘
    │
    ├─► 6.1 Start Both Apps
    │   cd ~/apps/loan-sarathi
    │   pm2 start ecosystem.config.js
    │
    ├─► 6.2 Verify Status
    │   pm2 status
    │   • loan-sarathi-backend  → online
    │   • loan-sarathi-frontend → online
    │
    └─► 6.3 Save PM2 Config
        pm2 save

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 7: CONFIGURE NGINX REVERSE PROXY                        ~10 mins  │
└──────────────────────────────────────────────────────────────────────────┘
    │
    ├─► 7.1 Create Nginx Config
    │   sudo nano /etc/nginx/sites-available/loansarathi
    │   (Copy configuration from guide)
    │
    ├─► 7.2 Enable Site
    │   sudo ln -s /etc/nginx/sites-available/loansarathi /etc/nginx/sites-enabled/
    │   sudo rm /etc/nginx/sites-enabled/default
    │
    ├─► 7.3 Test Configuration
    │   sudo nginx -t
    │   (Should show: test is successful)
    │
    └─► 7.4 Reload Nginx
        sudo systemctl reload nginx

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 8: SETUP SSL CERTIFICATE                                ~10 mins  │
└──────────────────────────────────────────────────────────────────────────┘
    │
    ├─► 8.1 Install Certbot
    │   sudo apt install -y certbot python3-certbot-nginx
    │
    ├─► 8.2 Obtain SSL Certificate
    │   sudo certbot --nginx -d loansarathi.com -d www.loansarathi.com
    │   • Enter email
    │   • Agree to ToS
    │   • Choose: Redirect HTTP to HTTPS
    │
    └─► 8.3 Test Auto-Renewal
        sudo certbot renew --dry-run

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 9: CONFIGURE FIREWALL                                   ~5 mins   │
└──────────────────────────────────────────────────────────────────────────┘
    │
    ├─► 9.1 Configure UFW
    │   sudo ufw allow 22/tcp   (SSH - IMPORTANT!)
    │   sudo ufw allow 80/tcp   (HTTP)
    │   sudo ufw allow 443/tcp  (HTTPS)
    │
    ├─► 9.2 Enable Firewall
    │   sudo ufw enable
    │
    └─► 9.3 Verify Rules
        sudo ufw status verbose

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 10: DATABASE OPTIMIZATION                               ~5 mins   │
└──────────────────────────────────────────────────────────────────────────┘
    │
    └─► 10.1 Create Indexes
        mongosh -u loanapp -p password loan-sarathi
        • db.loanApplications.createIndex({ applicationId: 1 })
        • db.insuranceApplications.createIndex({ applicationId: 1 })
        • db.galleryEvents.createIndex({ source: 1, isPublished: 1 })
        • (See full list in guide)
        exit

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 11: CONFIGURE GOOGLE OAUTH                              ~10 mins  │
└──────────────────────────────────────────────────────────────────────────┘
    │
    ├─► 11.1 Go to Google Cloud Console
    │   console.cloud.google.com
    │
    ├─► 11.2 Create OAuth Credentials
    │   APIs & Services → Credentials → Create OAuth 2.0 Client ID
    │
    ├─► 11.3 Add Authorized Redirect URIs
    │   • https://loansarathi.com/api/auth/callback/google
    │   • https://www.loansarathi.com/api/auth/callback/google
    │
    ├─► 11.4 Copy Credentials
    │   Get Client ID and Client Secret
    │
    └─► 11.5 Update .env.local
        nano ~/apps/loan-sarathi/frontend/.env.local
        pm2 restart loan-sarathi-frontend

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 12: TESTING & VERIFICATION                              ~15 mins  │
└──────────────────────────────────────────────────────────────────────────┘
    │
    ├─► 12.1 Test Backend API
    │   curl https://loansarathi.com/api/gallery/health
    │   (Should return JSON with success)
    │
    ├─► 12.2 Test Frontend
    │   Visit: https://loansarathi.com
    │   (Should load home page)
    │
    ├─► 12.3 Test Admin Login
    │   Visit: https://loansarathi.com/admin/signin
    │   Click "Sign in with Google"
    │
    ├─► 12.4 Test Application Forms
    │   • Loan Application
    │   • Insurance Application
    │   • Gallery Events
    │
    └─► 12.5 Check Logs
        pm2 logs
        (Should show no errors)

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 13: SETUP MONITORING (Optional)                         ~10 mins  │
└──────────────────────────────────────────────────────────────────────────┘
    │
    ├─► 13.1 Install fail2ban
    │   sudo apt install -y fail2ban
    │   sudo systemctl start fail2ban
    │
    ├─► 13.2 Setup Backup Script
    │   nano ~/backup.sh
    │   (Copy script from guide)
    │   chmod +x ~/backup.sh
    │
    └─► 13.3 Schedule Daily Backups
        crontab -e
        Add: 0 2 * * * /home/loanapp/backup.sh

┌──────────────────────────────────────────────────────────────────────────┐
│ ✅ DEPLOYMENT COMPLETE!                                                  │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          QUICK REFERENCE                                │
└─────────────────────────────────────────────────────────────────────────┘

Application URLs:
├─► Frontend:  https://loansarathi.com
├─► Admin:     https://loansarathi.com/admin
└─► API:       https://loansarathi.com/api/gallery/health

Application Paths:
├─► App Root:  /home/loanapp/apps/loan-sarathi
├─► Backend:   /home/loanapp/apps/loan-sarathi/backend
└─► Frontend:  /home/loanapp/apps/loan-sarathi/frontend

Important Files:
├─► Backend .env:    ~/apps/loan-sarathi/backend/.env
├─► Frontend .env:   ~/apps/loan-sarathi/frontend/.env.local
├─► Nginx Config:    /etc/nginx/sites-available/loansarathi
└─► PM2 Config:      ~/apps/loan-sarathi/ecosystem.config.js

Essential Commands:
├─► View Status:     pm2 status
├─► View Logs:       pm2 logs
├─► Restart Apps:    pm2 restart all
├─► Monitor:         pm2 monit
├─► Nginx Test:      sudo nginx -t
└─► Nginx Reload:    sudo systemctl reload nginx

Troubleshooting:
├─► Check Logs:      pm2 logs --lines 50
├─► Check Nginx:     sudo tail -f /var/log/nginx/loansarathi-error.log
├─► Check MongoDB:   sudo systemctl status mongod
├─► Test Backend:    curl http://localhost:5000/api/gallery/health
└─► Test Frontend:   curl http://localhost:3000

┌─────────────────────────────────────────────────────────────────────────┐
│                       TOTAL DEPLOYMENT TIME                             │
│                          ~2-3 Hours                                     │
│                 (including testing and verification)                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         POST-DEPLOYMENT                                 │
└─────────────────────────────────────────────────────────────────────────┘

Daily Maintenance:
├─► Check application status:  pm2 status
├─► Monitor logs:              pm2 logs
├─► Check disk space:          df -h
└─► Verify backups:            ls -lh ~/backups/

Weekly Tasks:
├─► Review error logs
├─► Check system updates:      sudo apt update && sudo apt list --upgradable
├─► Monitor database size:     mongosh → db.stats()
└─► Test backup restoration

Monthly Tasks:
├─► Update dependencies:       npm audit
├─► Review SSL certificates:   sudo certbot certificates
├─► Security audit:            sudo apt upgrade -y
└─► Performance optimization:  pm2 monit

┌─────────────────────────────────────────────────────────────────────────┐
│                       SUPPORT RESOURCES                                 │
└─────────────────────────────────────────────────────────────────────────┘

Documentation:
├─► Full Guide:       HOSTINGER_DEPLOYMENT_GUIDE.md
├─► Quick Commands:   QUICK_DEPLOY_COMMANDS.md
├─► Production Tips:  PRODUCTION_CHECKLIST.md
└─► Security:         SECURITY_AUDIT.md

Emergency Contacts:
├─► Hostinger Support:  support.hostinger.com
├─► Node.js Docs:       nodejs.org/docs
├─► Nginx Docs:         nginx.org/en/docs
└─► MongoDB Docs:       mongodb.com/docs

Monitoring Services:
├─► PM2 Plus:          pm2.io
├─► UptimeRobot:       uptimerobot.com
├─► Sentry:            sentry.io
└─► MongoDB Atlas:     mongodb.com/cloud/atlas

┌─────────────────────────────────────────────────────────────────────────┐
│  🎉 Your Loan Sarathi application is now live and production-ready!    │
└─────────────────────────────────────────────────────────────────────────┘
```
