#!/usr/bin/env node
import { createReadStream, existsSync, statSync } from 'node:fs';
import http from 'node:http';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('../../dist-pages/', import.meta.url));
const prefix = (process.env.VITE_BASE_PATH ?? '/fgs-baseui/').replace(/\/$/, '') || '';
const port = Number(process.env.PORT ?? 4173);

const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let relative = urlPath;
    if (prefix && (relative === prefix || relative === `${prefix}/`)) {
      relative = '/index.html';
    } else if (prefix && relative.startsWith(`${prefix}/`)) {
      relative = relative.slice(prefix.length);
    } else if (prefix) {
      res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
      return;
    }

    let file = join(siteRoot, relative);
    if (existsSync(file) && statSync(file).isDirectory()) {
      file = join(file, 'index.html');
    }
    if (!existsSync(file) || statSync(file).isDirectory()) {
      file = join(siteRoot, '404.html');
    }

    res.writeHead(200, {
      'cache-control': 'no-store',
      'content-type': mime[extname(file)] ?? 'application/octet-stream',
    });
    createReadStream(file).pipe(res);
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Pages preview http://127.0.0.1:${port}${prefix}/`);
  });
