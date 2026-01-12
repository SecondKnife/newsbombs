export function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (envUrl) {
    let url = envUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');
    return url;
  }
  
  return 'https://api.nhatbinhkt.com';
}

export function buildApiUrl(endpoint: string): string {
  const baseUrl = getApiUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  if (baseUrl) {
    return `${baseUrl}/${cleanEndpoint}`;
  }
  
  return `/${cleanEndpoint}`;
}

