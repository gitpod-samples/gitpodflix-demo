// API configuration - dynamically determine based on current window location
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    // For Gitpod environments, replace the port in the hostname
    if (hostname.includes('gitpod.dev')) {
      const gitpodUrl = hostname.replace(/^\d+-/, '3001-');
      return `${protocol}//${gitpodUrl}`;
    }
    // For localhost development
    return `${protocol}//${hostname}:3001`;
  }
  // Fallback for server-side rendering
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();
