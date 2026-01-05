// Helper function to get API URL without duplicate /api
// This ensures we don't get URLs like /api/api/auth/login
export function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (envUrl) {
    // Remove trailing slash and /api if present
    let url = envUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');
    return url;
  }
  
  // Fallback: use HTTPS tunnel endpoint
  // This ensures we always use HTTPS even if env var is not set
  return 'https://api.nhatbinhkt.com';
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

