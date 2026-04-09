import { Blog, Category } from '../lib/supabase';

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author?: string;
  category?: string;
  image?: string;
}

export interface RSSFeed {
  title: string;
  link: string;
  description: string;
  items: RSSItem[];
}

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://shoverhub.com';
const SITE_TITLE = 'ShoverHub';
const SITE_DESCRIPTION = 'Ideas Worth Sharing - Insights, tutorials, and stories from the ShoverHub team.';

export const generateRSSFeed = (blogs: Blog[]): string => {
  const items = blogs.map(blog => {
    const pubDate = blog.published_at 
      ? new Date(blog.published_at).toUTCString() 
      : new Date().toUTCString();
    
    return `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${SITE_URL}/blog/${blog.slug}</link>
      <description><![CDATA[${blog.excerpt || blog.title}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/blog/${blog.slug}</guid>
      ${blog.cover_image ? `<media:content url="${blog.cover_image}" type="image/jpeg"/>` : ''}
      ${blog.category ? `<category>${blog.category.name}</category>` : ''}
      <author>${blog.author_name}</author>
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title><![CDATA[${SITE_TITLE}]]></title>
    <link>${SITE_URL}</link>
    <description><![CDATA[${SITE_DESCRIPTION}]]></description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return rss;
};

export const generateCategoryRSS = (category: Category, blogs: Blog[]): string => {
  const items = blogs.map(blog => {
    const pubDate = blog.published_at 
      ? new Date(blog.published_at).toUTCString() 
      : new Date().toUTCString();
    
    return `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${SITE_URL}/blog/${blog.slug}</link>
      <description><![CDATA[${blog.excerpt || blog.title}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/blog/${blog.slug}</guid>
      ${blog.cover_image ? `<media:content url="${blog.cover_image}" type="image/jpeg"/>` : ''}
      <category>${category.name}</category>
      <author>${blog.author_name}</author>
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title><![CDATA[${SITE_TITLE} - ${category.name}]]></title>
    <link>${SITE_URL}/categories</link>
    <description><![CDATA[${category.description || category.name} articles from ShoverHub]]></description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss/${category.slug}.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return rss;
};

export const downloadRSS = (blogs: Blog[], filename: string = 'feed.xml') => {
  const rss = generateRSSFeed(blogs);
  const blob = new Blob([rss], { type: 'application/rss+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
