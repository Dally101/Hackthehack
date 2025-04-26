const express = require('express');
const path = require('path');
const compression = require('compression');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable gzip compression
app.use(compression());

// Set up proxy middleware for API requests
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // no rewrite needed
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Proxied ${req.method} ${req.url} → ${proxyRes.statusCode}`);
  },
}));

console.log('API requests proxied to http://localhost:5000');

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