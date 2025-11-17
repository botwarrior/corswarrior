const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CORS Proxy is running' });
});

// Main proxy endpoint
app.use('/', async (req, res) => {
  // Get the target URL from the query parameter or path
  const targetUrl = req.query.url || req.url.slice(1);

  if (!targetUrl) {
    return res.status(400).json({
      error: 'Missing URL parameter',
      usage: 'Use /?url=https://example.com or /https://example.com'
    });
  }

  // Validate URL
  let url;
  try {
    url = new URL(targetUrl);
  } catch (e) {
    return res.status(400).json({
      error: 'Invalid URL',
      message: e.message
    });
  }

  try {
    // Forward the request
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        ...req.headers,
        host: url.host,
      },
      data: req.body,
      validateStatus: () => true, // Don't throw on any status code
      maxRedirects: 5,
      timeout: 30000,
    });

    // Set CORS headers
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Expose-Headers': '*',
    });

    // Forward response headers (except some that might cause issues)
    const headersToSkip = ['content-encoding', 'transfer-encoding', 'connection'];
    Object.entries(response.headers).forEach(([key, value]) => {
      if (!headersToSkip.includes(key.toLowerCase())) {
        res.set(key, value);
      }
    });

    // Send the response
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({
      error: 'Proxy request failed',
      message: error.message
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CORS Proxy server running on port ${PORT}`);
  console.log(`Usage: http://localhost:${PORT}/?url=https://example.com`);
});
