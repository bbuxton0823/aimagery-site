import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('current-site');
const htmlFiles = ['index.html', 'aec/index.html', 'book/index.html', 'privacy/index.html', '_not-found/index.html'];
const stylesheet = '<link rel="stylesheet" href="/site-twin.css" data-site-twin-assets="true"/>';
const script = '<script src="/site-twin.js" defer data-site-twin-assets="true"></script>';

for (const relative of htmlFiles) {
  const file = path.join(root, relative);
  let html = await fs.readFile(file, 'utf8');
  html = html.replace(/<link[^>]+data-site-twin-assets="true"[^>]*\/>/g, '');
  html = html.replace(/<script[^>]+data-site-twin-assets="true"[^>]*><\/script>/g, '');
  html = html.replace('</head>', `${stylesheet}</head>`);
  html = html.replace('</body>', `${script}</body>`);
  await fs.writeFile(file, html);
  console.log(`injected ${relative}`);
}
