import fs from 'node:fs/promises';
import path from 'node:path';

const origin = 'https://aimagery-site.pages.dev';
const output = path.resolve('current-site');
const seeds = ['/', '/aec', '/book', '/privacy', '/site.webmanifest', '/robots.txt', '/sitemap.xml'];
const queue = [...seeds];
const seen = new Set();

function localPath(url, contentType) {
  const pathname = decodeURIComponent(url.pathname);
  if (contentType.includes('text/html')) {
    if (pathname === '/') return path.join(output, 'index.html');
    return path.join(output, pathname.replace(/^\//, ''), 'index.html');
  }
  return path.join(output, pathname.replace(/^\//, ''));
}

function discover(text) {
  const found = new Set();
  for (const match of text.matchAll(/(?:href|src|srcset|url\(|["'`])(\/[A-Za-z0-9_@./?=&%+,:;-]+)/g)) {
    const raw = match[1].replace(/[)'"`,;]+$/, '').split(/\s+/)[0];
    if (!raw || raw.startsWith('//') || raw.startsWith('/api/')) continue;
    found.add(raw);
  }
  return found;
}

await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });

while (queue.length) {
  const item = queue.shift();
  const url = new URL(item, origin);
  url.hash = '';
  const key = url.pathname + url.search;
  if (seen.has(key)) continue;
  seen.add(key);

  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) {
    console.error(`skip ${response.status} ${url.pathname}`);
    continue;
  }
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const buffer = Buffer.from(await response.arrayBuffer());
  const destination = localPath(url, contentType);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, buffer);
  console.log(`${response.status} ${url.pathname} -> ${path.relative(output, destination)}`);

  if (/text\/(html|css)|javascript|json/.test(contentType)) {
    const text = buffer.toString('utf8');
    for (const discovered of discover(text)) {
      const next = new URL(discovered, origin);
      if (next.origin === origin && !seen.has(next.pathname + next.search)) queue.push(discovered);
    }
  }
}
