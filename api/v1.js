// Vercel serverless function to proxy API requests
// This avoids Mixed Content issues (HTTPS -> HTTP)
// Maps to /api/v1/... path

export default async function handler(req, res) {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Vercel provides the full URL in req.url
  // Parse the URL to extract path and query
  let url;
  try {
    // req.url might be relative or absolute
    if (req.url.startsWith('http')) {
      url = new URL(req.url);
    } else {
      // Construct full URL from headers
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers.host || req.headers['x-forwarded-host'];
      url = new URL(req.url, `${protocol}://${host}`);
    }
  } catch (e) {
    // Fallback: parse manually
    const [pathname, search] = req.url.split('?');
    url = { pathname, searchParams: new URLSearchParams(search || '') };
  }
  
  // Extract path after /api/v1
  const pathname = typeof url.pathname === 'string' ? url.pathname : url.pathname?.toString() || req.url.split('?')[0];
  const apiPath = pathname.replace(/^\/api\/v1\/?/, '');
  
  // Backend API URL
  const backendUrl = `http://139.59.137.138/api/v1/${apiPath}`;
  
  // Get query string
  let queryString = '';
  if (url.searchParams && typeof url.searchParams.toString === 'function') {
    queryString = url.searchParams.toString();
  } else if (req.url.includes('?')) {
    queryString = req.url.split('?')[1];
  }
  
  const fullUrl = queryString ? `${backendUrl}?${queryString}` : backendUrl;
  
  // Get request method and headers
  const method = req.method;
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Forward authorization header if present
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization;
  }
  
  // Forward other important headers
  if (req.headers['content-type']) {
    headers['Content-Type'] = req.headers['content-type'];
  }
  
  // Prepare request options
  const options = {
    method,
    headers,
  };
  
  // Add body for POST, PUT, PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
    if (typeof req.body === 'string') {
      options.body = req.body;
    } else {
      options.body = JSON.stringify(req.body);
    }
  }
  
  try {
    // Make request to backend
    const response = await fetch(fullUrl, options);
    
    // Get response data
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    let data;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Forward content type
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    // Forward response status and data
    res.status(response.status);
    
    if (isJson) {
      res.json(data);
    } else {
      res.send(data);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy request failed', 
      message: error.message 
    });
  }
}

