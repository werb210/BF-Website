function normalizePath(pathname) {
  if (!pathname.startsWith('/')) return `/${pathname}`;
  return pathname;
}

export default function sitemap(options = {}) {
  const {
    hostname = '',
    routes = ['/', '/apply', '/business-loans', '/equipment-financing', '/about'],
  } = options;

  return {
    name: 'vite-plugin-sitemap',
    apply: 'build',
    generateBundle() {
      const entries = routes
        .map((route) => {
          const path = normalizePath(route);
          const url = `${hostname.replace(/\/$/, '')}${path}`;
          return `  <url><loc>${url}</loc></url>`;
        })
        .join('\n');

      const source = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source,
      });
    },
  };
}
