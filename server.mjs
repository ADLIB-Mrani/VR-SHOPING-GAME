import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(import.meta.dirname);
const mime = {'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
const allowed = new Set(['/','/index.html','/favicon.svg','/src/catalog.mjs','/src/core.mjs','/src/recommender.mjs','/src/app.mjs','/src/scene.mjs','/styles/main.css']);
const port = Number(process.env.PORT || 8080);
createServer(async (req,res)=>{
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname === '/' ? '/index.html' : url.pathname;
  if (!allowed.has(path)) {res.writeHead(404);res.end('Not found');return;}
  try {
    const file = resolve(root,'.'+path);
    if (!file.startsWith(root+sep)) throw new Error('Invalid path');
    const content = await readFile(file);
    res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"default-src 'self'; script-src 'self' https://aframe.io https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; worker-src 'self' blob:; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"});res.end(content);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(port,()=>console.log(`NOVA VR: http://localhost:${port}`));
