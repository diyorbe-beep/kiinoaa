// Vercel serverless function to proxy API requests
// Catch-all route: /api/v1/* → this function
// This avoids Mixed Content issues (HTTPS → HTTP)

export default async function handler(req, res) {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Get path from req.query.path (Vercel catch-all route)
  // For /api/v1/movies/ → req.query.path = ['movies']
  // For /api/v1/movies/123/ → req.query.path = ['movies', '123']
  let apiPath = '';
  let queryString = '';
  
  if (req.query && req.query.path) {
    // Path is an array from catch-all route
    apiPath = Array.isArray(req.query.path) 
      ? req.query.path.join('/') 
      : req.query.path;
    
    // Get other query params (ordering, limit, etc.)
    const otherParams = { ...req.query };
    delete otherParams.path;
    queryString = new URLSearchParams(otherParams).toString();
  } else {
    // Fallback: parse from URL
    const urlString = req.url || '';
    const [pathPart, queryPart] = urlString.split('?');
    apiPath = pathPart.replace(/^\/api\/v1\/?/, '').replace(/^\/?/, '');
    queryString = queryPart || '';
  }
  
  // Backend API URL - Production server
  const BACKEND_BASE_URL = 'http://139.59.137.138/api/v1';
  
  // Build backend URL correctly
  let backendUrl;
  if (apiPath) {
    backendUrl = `${BACKEND_BASE_URL}/${apiPath}`.replace(/\/+/g, '/').replace(':/', '://');
  } else {
    backendUrl = BACKEND_BASE_URL;
  }
  
  const fullUrl = queryString ? `${backendUrl}?${queryString}` : backendUrl;
  
  // Debug logging (always log for debugging)
  console.log('🔵 Vercel Proxy Request:', {
    originalUrl: req.url,
    query: req.query,
    path: req.query?.path,
    apiPath: apiPath || '(empty)',
    backendUrl,
    fullUrl,
    method: req.method
  });
  
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
    console.error('❌ Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy request failed', 
      message: error.message,
      details: {
        backendUrl: fullUrl,
        apiPath,
        query: req.query
      }
    });
  }
}

