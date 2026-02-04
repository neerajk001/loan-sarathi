function detectSource(req) {
    // Check for explicit source header
    const explicitSource = req.headers['x-application-source']?.toLowerCase();
    if (explicitSource === 'smartmumbaisolutions' || explicitSource === 'smartmumbai') {
        return 'smartmumbaisolutions';
    }
    if (explicitSource === 'loan-sarathi' || explicitSource === 'loansarathi') {
        return 'loan-sarathi';
    }

    const origin = (req.headers['origin'] || '').toLowerCase();
    const referer = (req.headers['referer'] || '').toLowerCase();
    const host = (req.headers['host'] || '').toLowerCase();

    const smartMumbaiPatterns = [
        'smartmumbaisolutions',
        'smartmumbai',
        'smartsolutionsmumbai',
        'smartsolutions',
    ];

    const checkString = `${origin} ${referer} ${host}`.toLowerCase();

    for (const pattern of smartMumbaiPatterns) {
        if (checkString.includes(pattern.toLowerCase())) {
            return 'smartmumbaisolutions';
        }
    }

    const loanSarathiPatterns = [
        'loansarathi',
        'loan-sarathi',
    ];

    for (const pattern of loanSarathiPatterns) {
        if (checkString.includes(pattern.toLowerCase())) {
            return 'loan-sarathi';
        }
    }

    return 'loan-sarathi';
}

function isSourceAllowed(source, endpoint) {
    if (endpoint.includes('/api/consultancy')) {
        return source === 'loan-sarathi';
    }
    return true;
}

module.exports = { detectSource, isSourceAllowed };
