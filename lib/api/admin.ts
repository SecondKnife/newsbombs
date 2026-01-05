// Helper function to get API URL without duplicate /api
// This ensures we don't get URLs like /api/api/auth/login
export function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (envUrl) {
    // Remove trailing slash and /api if present
    let url = envUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');
    return url;
  }
  
  // Fallback: use backend URL directly
  if (typeof window !== 'undefined') {
    // Client-side: return empty string to use relative /api (if proxied) or backend URL
    // For now, use backend URL directly
    return 'http://157.66.100.32:3001';
  }
  
  // Server-side fallback
  return 'http://157.66.100.32:3001';
}

// Build API endpoint URL
export function buildApiUrl(endpoint: string): string {
  const baseUrl = getApiUrl();
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  if (baseUrl) {
    return `${baseUrl}/${cleanEndpoint}`;
  }
  
  // If no base URL, return endpoint as-is (for relative URLs)
  return `/${cleanEndpoint}`;
}

