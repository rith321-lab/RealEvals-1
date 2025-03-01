// Script to build the React frontend
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

// Get the directory of this script
const rootDir = __dirname;
const clientDir = path.join(rootDir, 'client');
const distDir = path.join(clientDir, 'dist');

console.log(`Root directory: ${rootDir}`);
console.log(`Client directory: ${clientDir}`);

// Verify the client directory exists
if (!fs.existsSync(clientDir)) {
  console.error(`Error: Client directory not found at ${clientDir}`);
  process.exit(1);
}

// Change to the client directory
process.chdir(clientDir);
console.log(`Changed working directory to: ${process.cwd()}`);

// Build the frontend
console.log('Building frontend...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Frontend built successfully');
} catch (error) {
  console.error('Error building frontend:', error.message);
  process.exit(1);
}

// Verify dist directory exists
if (!fs.existsSync(distDir)) {
  console.error(`Error: Build output directory not found at ${distDir}`);
  process.exit(1);
}

// Serve the built frontend
console.log('Starting server to serve the built frontend...');
process.chdir(distDir);
console.log(`Changed working directory to: ${process.cwd()}`);

const server = http.createServer((req, res) => {
  // Default to index.html for all routes (for SPA)
  let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);
  
  // If path doesn't have an extension, serve index.html (for SPA routing)
  if (!path.extname(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found, serve index.html
        fs.readFile(path.join(distDir, 'index.html'), (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
      return;
    }
    
    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Open your browser to http://localhost:${PORT}/`);
});
