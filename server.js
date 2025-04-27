const express = require('express');
const path = require('path');
const compression = require('compression');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3001;
const FLASK_PORT = process.env.FLASK_PORT || 5000;
const MARKETING_AGENT_PORT = process.env.MARKETING_AGENT_PORT || 5001;

// Enable gzip compression
app.use(compression());

// Set up proxy middleware for API requests
app.use('/api', createProxyMiddleware({
  target: `http://localhost:${FLASK_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // no rewrite needed
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Proxied API ${req.method} ${req.url} → ${proxyRes.statusCode}`);
  },
}));

// Set up proxy middleware for Marketing Agent requests
app.use('/marketing-agent', createProxyMiddleware({
  target: `http://localhost:${MARKETING_AGENT_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/marketing-agent': '/', // rewrite to root path
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Proxied Marketing Agent ${req.method} ${req.url} → ${proxyRes.statusCode}`);
  },
}));

console.log(`API requests proxied to http://localhost:${FLASK_PORT}`);
console.log(`Marketing Agent requests proxied to http://localhost:${MARKETING_AGENT_PORT}`);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any request that doesn't match one of our static files,
// send the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT}`);
  console.log(`You can access the application at http://localhost:${PORT}`);
}); 