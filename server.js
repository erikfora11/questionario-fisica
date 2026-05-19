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
    '.jpg': 'image/jpg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Remove query string if present
    let urlPath = req.url.split('?')[0];
    
    let filePath;
    if (urlPath === '/') {
        filePath = path.join(__dirname, 'public/index.html');
    } else if (urlPath.startsWith('/data/')) {
        filePath = path.join(__dirname, urlPath);
    } else {
        filePath = path.join(__dirname, 'public', urlPath);
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>404</title></head><body><h1>404 - Archivo no encontrado</h1></body></html>');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\nServidor corriendo en http://localhost:${PORT}`);
    console.log('Presiona Ctrl+C para detener el servidor\n');
});