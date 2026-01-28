import { NextRequest } from 'next/server';

/**
 * Source detection utility
 * Detects the source of the request (loan-sarathi or smartmumbaisolutions)
 * Default: 'loan-sarathi'
 */
export function detectSource(request: NextRequest): 'loan-sarathi' | 'smartmumbaisolutions' {
  // First, check for explicit source header (highest priority)
  const explicitSource = request.headers.get('x-application-source')?.toLowerCase();
  if (explicitSource === 'smartmumbaisolutions' || explicitSource === 'smartmumbai') {
    return 'smartmumbaisolutions';
  }
  if (explicitSource === 'loan-sarathi' || explicitSource === 'loansarathi') {
    return 'loan-sarathi';
  }  

  const origin = (request.headers.get('origin') || '').toLowerCase();
  const referer = (request.headers.get('referer') || '').toLowerCase();
  const host = (request.headers.get('host') || '').toLowerCase();

  // Check if request is from smartmumbaisolutions (case-insensitive)
  const smartMumbaiPatterns = [
    'smartmumbaisolutions',
    'smartmumbai',
    'smartsolutionsmumbai', // Alternative domain
    'smartsolutions', // Alternative domain
  ];

  const checkString = `${origin} ${referer} ${host}`.toLowerCase();

  for (const pattern of smartMumbaiPatterns) {
    if (checkString.includes(pattern.toLowerCase())) {
      return 'smartmumbaisolutions';
    }
  }

  // Check if request is from loan-sarathi
  const loanSarathiPatterns = [
    'loansarathi',
    'loan-sarathi',
  ];

  for (const pattern of loanSarathiPatterns) {
    if (checkString.includes(pattern.toLowerCase())) {
      return 'loan-sarathi';
    }
  }

  // Default to loan-sarathi
  return 'loan-sarathi';
}

/**
 * Check if source is allowed for a specific endpoint
 */
export function isSourceAllowed(
  source: 'loan-sarathi' | 'smartmumbaisolutions',
  endpoint: string
): boolean {
  // Consultancy endpoint is only for loan-sarathi
  if (endpoint.includes('/api/consultancy')) {
    return source === 'loan-sarathi';
  }

  // All other endpoints are allowed for both sources
  return true;
}



