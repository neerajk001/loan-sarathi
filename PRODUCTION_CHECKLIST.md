# Production Readiness Checklist

## ✅ Completed Fixes

### 1. Database Connection
- ✅ Added proper error handling for MongoDB connection
- ✅ Implemented graceful shutdown handlers (SIGINT, SIGTERM)
- ✅ Added connection pool configuration for optimal performance
- ✅ Environment variable validation

### 2. Configuration
- ✅ Created `.env.example` files for documentation
- ✅ Fixed hardcoded localhost URLs in Next.config
- ✅ Made CORS origins configurable via environment variables
- ✅ Added proper security headers

### 3. Memory Management
- ✅ Fixed memory leaks in cache cleanup intervals
- ✅ Added destroy methods for graceful shutdown
- ✅ Implemented proper cleanup handlers

### 4. Body Parsing
- ✅ Increased body limit from 10kb to 5mb
- ✅ Added URL-encoded body parsing

### 5. Logging & Monitoring
- ✅ Enhanced server startup logging
- ✅ Added environment information display
- ✅ Improved error logging with context

## 🔧 Required Configuration Before Production

### 1. Environment Variables

#### Backend (.env)
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/loan-sarathi
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://loansarathi.com,https://www.loansarathi.com
```

#### Frontend (.env.local)
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/loan-sarathi
NEXTAUTH_URL=https://loansarathi.com
NEXTAUTH_SECRET=your-secure-random-secret-min-32-characters
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BACKEND_URL=https://api.loansarathi.com
NEXT_PUBLIC_BASE_URL=https://loansarathi.com
EMAIL_ENABLED=true
EMAIL_FROM=noreply@loansarathi.com
```

### 2. Email Service Setup

Choose ONE email provider:

#### Option A: Resend (Recommended)
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

Update `frontend/src/lib/email.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  if (!process.env.EMAIL_ENABLED || process.env.EMAIL_ENABLED !== 'true') {
    console.log('Email sending disabled');
    return false;
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@loansarathi.com',
      to: template.to,
      subject: template.subject,
      html: template.html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}
```

#### Option B: SendGrid
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

### 3. MongoDB Indexes (Performance)

Run these commands in MongoDB shell or Atlas UI:

```javascript
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
```

### 4. Security Configuration

#### A. Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

#### B. Configure Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `https://loansarathi.com/api/auth/callback/google`
   - `https://www.loansarathi.com/api/auth/callback/google`

#### C. SSL/TLS
- Ensure your domain has valid SSL certificate
- Use Let's Encrypt for free certificates
- Configure your reverse proxy (Nginx/Apache) with HTTPS

### 5. Deployment Configuration

#### PM2 Ecosystem (ecosystem.config.js)
The current configuration is ready. Just ensure:
- `NODE_ENV=production` is set
- Memory limits are appropriate for your server
- Logs directory exists

#### Docker (Optional)
If using Docker, create `Dockerfile`:
```dockerfile
FROM node:18-alpine

# Backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./

# Frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

EXPOSE 3000 5000

CMD ["npm", "run", "start"]
```

### 6. Monitoring & Logging

#### Recommended Tools:
- **PM2 Plus**: Application monitoring (free tier available)
- **Sentry**: Error tracking
- **LogRocket**: Session replay and logging
- **New Relic**: APM monitoring

#### Add to your app:
```bash
npm install @sentry/nextjs --save
npm install @sentry/node --save # for backend
```

### 7. Database Backups

#### MongoDB Atlas (Recommended):
- Enable automated backups
- Set retention policy (7-30 days)
- Test restore procedure

#### Manual Backup:
```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/loan-sarathi" --out=/backup/$(date +%Y%m%d)
```

### 8. Rate Limiting Enhancement

Current: 100 requests per 15 minutes per IP

For production, consider:
- Different limits for different endpoints
- API key authentication for partners
- DDoS protection via Cloudflare

### 9. File Upload Security

Current limits:
- Max file size: 5MB
- Allowed types: JPEG, PNG, WebP

Consider adding:
- Virus scanning (ClamAV)
- Image optimization (Sharp)
- CDN for static files (Cloudflare, AWS CloudFront)

### 10. Performance Optimization

- [ ] Enable Redis for caching (replace in-memory cache)
- [ ] Use CDN for static assets
- [ ] Enable HTTP/2
- [ ] Implement image lazy loading
- [ ] Add service worker for PWA

## 📊 Testing Before Production

### 1. Load Testing
```bash
npm install -g artillery
artillery quick --count 100 --num 50 https://your-api.com/api/health
```

### 2. Security Scanning
```bash
npm audit
npm audit fix
```

### 3. API Testing
Test all endpoints:
- `/api/gallery/health`
- `/api/gallery/events`
- `/api/applications/loan`
- `/api/applications/insurance`
- Admin endpoints with authentication

### 4. Error Scenarios
Test:
- Database connection failure
- Invalid input data
- File upload errors
- Authentication failures
- Rate limit exceeded

## 🚀 Deployment Steps

1. **Prepare Environment**
   ```bash
   # On production server
   git clone <your-repo>
   cd my-app
   ```

2. **Install Dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure Environment**
   ```bash
   # Copy and edit .env files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   # Edit with production values
   ```

4. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

5. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

6. **Configure Reverse Proxy**
   
   Nginx example:
   ```nginx
   server {
       listen 443 ssl http2;
       server_name loansarathi.com www.loansarathi.com;
       
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
       
       # Frontend
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Backend
       location /api/gallery {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header Host $host;
       }
   }
   ```

7. **Verify Deployment**
   ```bash
   curl https://loansarathi.com/api/gallery/health
   ```

## 🔍 Post-Deployment Monitoring

Monitor these metrics:
- Response times (should be < 500ms)
- Error rates (should be < 1%)
- Memory usage
- CPU usage
- Database connections
- Cache hit rates

## 📝 Known Limitations

1. **Email**: Currently only logs in development. Requires Resend/SendGrid setup.
2. **Caching**: In-memory cache will be cleared on restart. Consider Redis for production.
3. **File Storage**: Local file system. Consider S3/CloudStorage for multi-server deployments.
4. **Admin Emails**: Hardcoded in some places. Should fetch from database settings.

## 🆘 Troubleshooting

### Server won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Check port availability: `lsof -i :3000` and `lsof -i :5000`

### Database connection issues
- Verify MongoDB Atlas IP whitelist
- Check network connectivity
- Verify credentials

### Email not sending
- Verify EMAIL_ENABLED=true
- Check email service API key
- Review email service logs

### High memory usage
- Check for memory leaks with `pm2 monit`
- Adjust max_memory_restart in ecosystem.config.js
- Review cache size and TTL

## 🔐 Security Reminders

- [ ] Change all default passwords
- [ ] Rotate API keys regularly
- [ ] Keep dependencies updated
- [ ] Enable 2FA for admin accounts
- [ ] Regular security audits
- [ ] Monitor for suspicious activity
- [ ] Implement rate limiting per user
- [ ] Add CAPTCHA for public forms
- [ ] Regular database backups
- [ ] Disaster recovery plan

## 📚 Additional Resources

- [Next.js Production Checklist](https://nextjs.org/docs/deployment)
- [MongoDB Production Notes](https://www.mongodb.com/docs/manual/administration/production-notes/)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
