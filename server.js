const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    let urlPath = req.url.split('?')[0];
    if (urlPath !== '/' && urlPath.endsWith('/')) {
        urlPath = urlPath.slice(0, -1);
    }
    
    let filePath;
    if (urlPath === '/') {
        filePath = path.join(__dirname, 'public', 'index.html');
    } else if (urlPath.startsWith('/data/')) {
        filePath = path.join(__dirname, urlPath);
    } else {
        filePath = path.join(__dirname, 'public', urlPath);
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            console.error('Error reading file:', filePath, error);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>404</title><style>body{font-family:sans-serif;text-align:center;padding:50px}button{background:#56AA90;color:white;border:none;padding:10px 20px;border-radius:5px;cursor:pointer}</style></head><body><h1>404 - No encontrado</h1><p>La página que buscas no existe.</p><button onclick="window.location.href=\'/\'">Volver al inicio</button></body></html>');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});