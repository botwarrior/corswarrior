# CORS Proxy

A simple CORS proxy server that allows you to bypass CORS restrictions when making requests from your browser.

## Features

- 🔓 Bypass CORS restrictions
- 🚀 Easy to deploy with Docker
- 🔄 Supports all HTTP methods (GET, POST, PUT, DELETE, etc.)
- 📦 Lightweight Node.js implementation
- 🏥 Health check endpoint

## Quick Start

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

### Using Docker

```bash
# Build the image
docker build -t cors-proxy .

# Run the container
docker run -d -p 8080:8080 --name cors-proxy cors-proxy
```

### Without Docker

```bash
# Install dependencies
npm install

# Start the server
npm start
```

## Usage

Once the server is running, you can proxy requests in two ways:

### Method 1: Query Parameter

```
http://localhost:8080/?url=https://api.example.com/data
```

### Method 2: Path-based

```
http://localhost:8080/https://api.example.com/data
```

### Example with JavaScript

```javascript
// Instead of making a direct request (which might fail due to CORS):
// fetch('https://api.example.com/data')

// Use the proxy:
fetch('http://localhost:8080/?url=https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Example with cURL

```bash
curl "http://localhost:8080/?url=https://api.example.com/data"
```

## Health Check

Check if the proxy is running:

```bash
curl http://localhost:8080/health
```

## Configuration

You can change the port by setting the `PORT` environment variable:

```bash
# Docker Compose
PORT=3000 docker-compose up

# Docker
docker run -d -p 3000:3000 -e PORT=3000 --name cors-proxy cors-proxy

# Node.js
PORT=3000 npm start
```

## Security Considerations

⚠️ **Important**: This proxy allows requests to any URL, which can be a security risk if exposed publicly. Consider:

1. Running it only in development/testing environments
2. Implementing authentication/authorization
3. Whitelisting allowed domains
4. Using rate limiting
5. Running behind a firewall

## How It Works

The proxy:
1. Receives your request
2. Forwards it to the target URL
3. Receives the response from the target
4. Adds CORS headers to the response
5. Sends it back to you

This allows your browser to receive the data without CORS errors.

## Troubleshooting

### Container not starting
```bash
# Check logs
docker logs cors-proxy

# Or with docker-compose
docker-compose logs
```

### Port already in use
Change the port mapping in docker-compose.yml:
```yaml
ports:
  - "3000:8080"  # Use port 3000 instead
```

## License

MIT
