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
    console.log('[Source Detection] Using explicit header: smartmumbaisolutions');
    return 'smartmumbaisolutions';
  }
  if (explicitSource === 'loan-sarathi' || explicitSource === 'loansarathi') {
    console.log('[Source Detection] Using explicit header: loan-sarathi');
    return 'loan-sarathi';
  }
  
  const origin = (request.headers.get('origin') || '').toLowerCase();
  const referer = (request.headers.get('referer') || '').toLowerCase();
  const host = (request.headers.get('host') || '').toLowerCase();
  
  // Log for debugging (remove in production if needed)
  console.log('[Source Detection]', {
    origin,
    referer,
    host,
    explicitSource,
  });
  
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
      console.log(`[Source Detection] Detected as smartmumbaisolutions (matched: ${pattern})`);
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
      console.log(`[Source Detection] Detected as loan-sarathi (matched: ${pattern})`);
      return 'loan-sarathi';
    }
  }
  
  // For localhost/development: if no explicit source header, default to loan-sarathi
  // NOTE: For Smart Mumbai Solutions testing on localhost, MUST use X-Application-Source header
  if (origin.includes('localhost') || host.includes('localhost')) {
    console.log('[Source Detection] Localhost detected - defaulting to loan-sarathi. Use X-Application-Source header to override.');
  }
  
  // Default to loan-sarathi
  console.log('[Source Detection] Defaulting to loan-sarathi (no match found)');
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



