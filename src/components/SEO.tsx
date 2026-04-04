import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  category?: string;
  tags?: string[];
  jsonLd?: object;
}

const SITE_NAME = 'ShoverHub';
const SITE_TAGLINE = 'Ideas Worth Sharing';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://blog.shoverhub.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const LOCALE = 'en_US';

export const SEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  author,
  category,
  tags,
  jsonLd,
}: SEOProps) => {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;

    const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;

    const linkTags = [
      { rel: 'canonical', href: canonicalUrl },
    ];

    linkTags.forEach(({ rel, href }) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    });

    const metaTags: { name?: string; property?: string; content: string }[] = [
      { name: 'description', content: description },
      { name: 'keywords', content: tags?.join(', ') || '' },
      { name: 'author', content: author || SITE_NAME },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image || DEFAULT_IMAGE },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:locale', content: LOCALE },
      { property: 'og:url', content: canonicalUrl },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image || DEFAULT_IMAGE },
      { name: 'twitter:site', content: '@shoverhub' },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    ];

    if (publishedTime && type === 'article') {
      metaTags.push({ property: 'article:published_time', content: publishedTime });
    }

    if (author && type === 'article') {
      metaTags.push({ property: 'article:author', content: author });
    }

    if (category && type === 'article') {
      metaTags.push({ property: 'article:section', content: category });
    }

    if (tags && type === 'article') {
      tags.forEach(tag => {
        metaTags.push({ property: 'article:tag', content: tag });
      });
    }

    metaTags.forEach(({ name, property, content }) => {
      if (!content) return;
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        if (name) element.setAttribute('name', name);
        if (property) element.setAttribute('property', property);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    });

    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: 'https://shoverhub.com',
      logo: 'https://shoverhub.com/assets/logo.png',
      sameAs: [
        'https://twitter.com/shoverhub',
        'https://github.com/shoverhub',
      ],
    };

    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: `Insights, tutorials, and stories from the ${SITE_NAME} team. ${SITE_TAGLINE}.`,
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: 'https://shoverhub.com',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };

    const schemasToInject = jsonLd 
      ? [organizationSchema, websiteSchema, jsonLd] 
      : [organizationSchema, websiteSchema];

    let schemaScript = document.querySelector('script[data-type="ld+json"]') as HTMLScriptElement | null;
    if (schemaScript) {
      schemaScript.remove();
    }

    schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.setAttribute('data-type', 'ld+json');
    schemaScript.textContent = JSON.stringify(
      schemasToInject.length === 1 ? schemasToInject[0] : { '@graph': schemasToInject }
    );
    document.head.appendChild(schemaScript);
  }, [title, description, image, url, type, publishedTime, author, category, tags, jsonLd]);

  return null;
};
