import { useEffect } from 'react';

interface AdminSEOProps {
  title: string;
}

export const AdminSEO = ({ title }: AdminSEOProps) => {
  useEffect(() => {
    document.title = `${title} | Admin`;

    const metaTags = [
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'googlebot', content: 'noindex, nofollow' },
    ];

    metaTags.forEach(({ name, content }) => {
      const selector = `meta[name="${name}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    });
  }, [title]);

  return null;
};
