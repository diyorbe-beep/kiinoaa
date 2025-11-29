// Vercel serverless function to proxy API requests
// This avoids Mixed Content issues (HTTPS -> HTTP)
// Catch-all route: /api/v1/... maps to this function

export default async function handler(req, res) {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Vercel catch-all routes: req.query.path will be an array
  // For /api/v1/movies/, req.query.path = ['movies']
  // For /api/v1/movies/123/, req.query.path = ['movies', '123']
  const pathParam = req.query.path;
  let apiPath = '';
  
  if (pathParam) {
    if (Array.isArray(pathParam)) {
      apiPath = pathParam.join('/');
    } else {
      apiPath = pathParam;
    }
  }
  
  // Backend API URL
  const backendUrl = `http://139.59.137.138/api/v1/${apiPath}`;
  
  // Get query string from request (excluding 'path' parameter)
  const queryParams = { ...req.query };
  delete queryParams.path;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = queryString ? `${backendUrl}?${queryString}` : backendUrl;
  
  // Log for debugging
  console.log('Proxy request:', {
    originalUrl: req.url,
    pathParam,
    apiPath,
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
    console.error('Proxy error:', error);
    console.error('Request details:', {
      url: req.url,
      query: req.query,
      pathParam,
      apiPath,
      fullUrl
    });
    res.status(500).json({ 
      error: 'Proxy request failed', 
      message: error.message 
    });
  }
}

