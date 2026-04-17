import { Blog, Category } from '../lib/supabase';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://shoverhub.com';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (
  blogs: Blog[],
  categories: Category[]
): string => {
  const urls: SitemapUrl[] = [
    { loc: SITE_URL, changefreq: 'daily', priority: 1.0 },
    { loc: `${SITE_URL}/categories`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${SITE_URL}/about`, changefreq: 'monthly', priority: 0.5 },
    { loc: `${SITE_URL}/contact`, changefreq: 'monthly', priority: 0.5 },
    { loc: `${SITE_URL}/privacy-policy`, changefreq: 'yearly', priority: 0.3 },
    { loc: `${SITE_URL}/terms-of-service`, changefreq: 'yearly', priority: 0.3 },
  ];

  categories.forEach(cat => {
    urls.push({
      loc: `${SITE_URL}/categories?cat=${cat.slug}`,
      changefreq: 'weekly',
      priority: 0.7,
    });
  });

  blogs.forEach(blog => {
    urls.push({
      loc: `${SITE_URL}/blog/${blog.slug}`,
      lastmod: blog.updated_at || blog.published_at,
      changefreq: 'weekly',
      priority: 0.8,
    });
  });

  const urlEntries = urls.map(url => {
    let entry = `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority || 0.5}</priority>`;
    
    if (url.lastmod) {
      entry += `
    <lastmod>${new Date(url.lastmod).toISOString()}</lastmod>`;
    }
    
    entry += `
  </url>`;
    return entry;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return sitemap;
};

export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml

Disallow: /shover-admin/
Disallow: /shover-admin
`;
};

export const downloadSitemap = (blogs: Blog[], categories: Category[], filename: string = 'sitemap.xml') => {
  const sitemap = generateSitemap(blogs, categories);
  const blob = new Blob([sitemap], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
