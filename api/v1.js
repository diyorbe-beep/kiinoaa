// Vercel serverless function to proxy API requests
// This avoids Mixed Content issues (HTTPS -> HTTP)
// Maps to /api/v1/... path using rewrites

export default async function handler(req, res) {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Get path from req.url (Vercel provides full URL in req.url)
  // req.url will be like: /api/v1/movies?ordering=-created_at&limit=20
  const url = new URL(req.url, `https://${req.headers.host || 'example.com'}`);
  const pathname = url.pathname;
  
  // Remove /api/v1 prefix to get the actual API path
  const apiPath = pathname.replace(/^\/api\/v1\/?/, '');
  
  // Backend API URL
  const backendUrl = `http://139.59.137.138/api/v1/${apiPath}`;
  
  // Get query string from URL
  const queryString = url.searchParams.toString();
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

