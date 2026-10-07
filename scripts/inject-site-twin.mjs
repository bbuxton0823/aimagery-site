import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('current-site');
const htmlFiles = ['index.html', 'aec/index.html', 'book/index.html', 'privacy/index.html', '_not-found/index.html'];
const stylesheet = '<link rel="stylesheet" href="/site-twin.css?v=20261007-5" data-site-twin-assets="true"/>';
const script = '<script src="/site-twin.js?v=20261007-5" defer data-site-twin-assets="true"></script>';

for (const relative of htmlFiles) {
  const file = path.join(root, relative);
  let html = await fs.readFile(file, 'utf8');
  html = html.replace(/<link[^>]+data-site-twin-assets="true"[^>]*\/>/g, '');
  html = html.replace(/<script[^>]+data-site-twin-assets="true"[^>]*><\/script>/g, '');
  if (relative === 'aec/index.html') {
    html = html.replaceAll('autostart=1', 'autostart=0');
    const sketchfabSource = 'src="https://sketchfab.com/models/a326d70b3947459386473ca3075c9eec/embed?autostart=0&amp;ui_theme=dark"';
    const lazySketchfabSource = `${sketchfabSource} loading="lazy" fetchpriority="low"`;
    html = html.replace(lazySketchfabSource, sketchfabSource);
    html = html.replace(sketchfabSource, lazySketchfabSource);
  }
  html = html.replace('</head>', `${stylesheet}</head>`);
  html = html.replace('</body>', `${script}</body>`);
  await fs.writeFile(file, html);
  console.log(`injected ${relative}`);
}
