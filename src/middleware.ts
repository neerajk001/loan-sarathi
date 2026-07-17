import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // List of allowed domains for CORS
  // Production domains
  const productionOrigins = [
    // Loan Sarathi domains (default)
    'https://loansarathi.com',
    'https://www.loansarathi.com',
    // Smart Mumbai Solutions domains (primary: smartsolutionsmumbai.com)
    'https://smartsolutionsmumbai.com',
    'https://www.smartsolutionsmumbai.com',
    // Additional Smart Mumbai Solutions domains (redirects/aliases)
    'https://smartmumbaisolutions.com',
    'https://www.smartmumbaisolutions.com',
    'https://smartmumbai.com',
    'https://www.smartmumbai.com',
  ];
  
  // Development domains (only in development mode)
  const developmentOrigins = process.env.NODE_ENV === 'development' ? [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
  ] : [];
  
  const allowedOrigins = [...productionOrigins, ...developmentOrigins];

  const origin = request.headers.get('origin');

  // Set CORS headers for allowed origins
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, X-Application-Source'
    );
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  }

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 200,
      headers: response.headers 
    });
  }

  return response;
}

// Apply middleware only to API routes
export const config = {
  matcher: '/api/:path*',
};
