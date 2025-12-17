# API Integration Guide

## 🎯 Your Backend is Now Ready for External Access

CORS has been enabled on all `/api/*` routes. External frontends can now call your API endpoints.

---

## 🔌 API Base URL

**Development**: `http://localhost:3000`  
**Production**: `https://loansarathi.com` (or your deployed URL)

---

## 📡 Available API Endpoints

### 1. Loan Application Submission
```
POST /api/applications/loan
Content-Type: application/json

Body:
{
  "loanType": "personal",
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobileNumber": "9876543210",
  "panCard": "ABCDE1234F",
  "dateOfBirth": "1990-01-01",
  "currentAddress": "123 Main St",
  "pincode": "400001",
  "employmentType": "salaried",
  "monthlyIncome": "50000",
  "companyName": "ABC Corp",
  "existingEmi": "5000",
  "loanAmount": "500000",
  "tenure": "36",
  "loanPurpose": "Personal use"
}

Response:
{
  "success": true,
  "applicationId": "LOAN-2025-00001",
  "message": "Application submitted successfully"
}
```

### 2. Insurance Application Submission
```
POST /api/applications/insurance
Content-Type: application/json

Body:
{
  "insuranceType": "health",
  "fullName": "Jane Smith",
  "mobileNumber": "9876543210",
  "email": "jane@example.com",
  "dateOfBirth": "1990-01-01",
  "pincode": "400001",
  "sumInsured": "500000"
}

Response:
{
  "success": true,
  "applicationId": "INS-2025-00001",
  "message": "Quote request submitted successfully"
}
```

### 3. Consultancy Request
```
POST /api/consultancy
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "mobile": "9876543210",
  "email": "john@example.com",
  "loanType": "Personal Loan"
}

Response:
{
  "success": true,
  "message": "Consultancy request submitted successfully"
}
```

### 4. Get Loan Applications (Admin - Protected)
```
GET /api/admin/applications?type=loan&page=1&limit=10
Content-Type: application/json

Response:
{
  "applications": [...],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

### 5. Update Application Status (Admin - Protected)
```
PATCH /api/admin/applications/{id}
Content-Type: application/json

Body:
{
  "status": "approved",
  "notes": "Application verified and approved"
}

Response:
{
  "success": true,
  "message": "Application updated successfully"
}
```

---

## 💻 Example: Frontend Integration

### For External React/Next.js Frontend

Create `src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// Loan Application
export async function submitLoanApplication(data: any) {
  return apiCall('/api/applications/loan', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Insurance Application
export async function submitInsuranceApplication(data: any) {
  return apiCall('/api/applications/insurance', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Consultancy Request
export async function requestConsultancy(data: any) {
  return apiCall('/api/consultancy', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

### Usage in Component

```typescript
import { submitLoanApplication } from '@/lib/api';

export default function LoanForm() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await submitLoanApplication(formData);
      alert(`Success! Application ID: ${result.applicationId}`);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## 🔐 CORS Configuration

**Allowed Origins** (update in `src/middleware.ts`):
- https://loansarathi.com
- https://www.loansarathi.com
- https://smartsolutions.com
- https://www.smartsolutions.com
- http://localhost:3000-3003 (for development)

**Allowed Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS  
**Allowed Headers**: Content-Type, Authorization, X-Requested-With

---

## 🧪 Testing CORS

### Test from Browser Console

```javascript
fetch('http://localhost:3000/api/consultancy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    mobile: '9876543210',
    email: 'test@example.com',
    loanType: 'Personal Loan'
  })
})
.then(r => r.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

### Test with cURL

```bash
curl -X POST http://localhost:3000/api/consultancy \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3001" \
  -d '{
    "name": "Test User",
    "mobile": "9876543210",
    "email": "test@example.com",
    "loanType": "Personal Loan"
  }'
```

---

## 📝 Environment Variables for External Frontend

Create `.env.local` in your external frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
# OR for production:
# NEXT_PUBLIC_API_URL=https://loansarathi.com
```

---

## ✅ What's Already Working

- ✅ CORS enabled for all API routes
- ✅ Multiple frontend origins supported
- ✅ Preflight OPTIONS requests handled
- ✅ Credentials support enabled
- ✅ Current site still works normally
- ✅ Admin dashboard accessible

---

## 🚀 Next Steps

1. **Deploy to Production** - Your API will be accessible at production URL
2. **Update Allowed Origins** - Add actual production domains to `src/middleware.ts`
3. **Build External Frontend** - Use the API integration code above
4. **Monitor Usage** - Check admin dashboard for applications from all sources

---

## 🆘 Troubleshooting

**CORS Error in Browser Console:**
- ✅ Restart dev server (`npm run dev`)
- ✅ Check origin is in allowedOrigins array in `src/middleware.ts`
- ✅ Clear browser cache

**API Not Responding:**
- ✅ Verify endpoint URL is correct
- ✅ Check MongoDB connection
- ✅ Check request body format matches API requirements

**Admin Dashboard Not Working:**
- ✅ Go to `/admin` on main site (not external frontend)
- ✅ Use password from ADMIN_PASSWORD env variable

---

## 📊 Database

All applications from any frontend will be stored in the same MongoDB database and visible in your admin dashboard at `/admin`.

---

**Status**: ✅ CORS Enabled - Ready for External Frontends  
**Updated**: December 13, 2025
