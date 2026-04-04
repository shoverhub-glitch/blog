import { Blog } from '../lib/supabase';

const SITE_NAME = 'ShoverHub';
const SITE_TAGLINE = 'Ideas Worth Sharing';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://blog.shoverhub.com';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const createArticleSchema = (blog: Blog) => {
  const articleUrl = `${SITE_URL}/blog/${blog.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.cover_image || undefined,
    url: articleUrl,
    datePublished: blog.published_at || blog.created_at,
    dateModified: blog.updated_at,
    author: {
      '@type': 'Organization',
      name: blog.author_name || SITE_NAME,
      url: 'https://shoverhub.com',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: 'https://shoverhub.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://shoverhub.com/assets/logo.png',
      },
      sameAs: [
        'https://twitter.com/shoverhub',
      ],
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: blog.category?.name,
    keywords: blog.tags?.map(t => t.name).join(', '),
  };
};

export const createBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  const breadcrumbItems = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.url}`,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };
};

export const createCategorySchema = (name: string, description: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${name} | ${SITE_NAME}`,
    description: `${description} - ${SITE_TAGLINE}`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: 'https://shoverhub.com',
    },
  };
};
