const prefetched = new Set<string>();

type PrefetchKey =
  | 'home'
  | 'blog-detail'
  | 'search'
  | 'categories'
  | 'about'
  | 'contact'
  | 'privacy-policy'
  | 'terms-of-service'
  | 'admin-login';

export const prefetchRoute = (key: PrefetchKey): void => {
  if (prefetched.has(key)) return;
  prefetched.add(key);

  switch (key) {
    case 'home':
      void import('../pages/HomePage');
      break;
    case 'blog-detail':
      void import('../pages/BlogDetailPage');
      break;
    case 'search':
      void import('../pages/SearchPage');
      break;
    case 'categories':
      void import('../pages/CategoriesPage');
      break;
    case 'about':
      void import('../pages/AboutPage');
      break;
    case 'contact':
      void import('../pages/ContactPage');
      break;
    case 'privacy-policy':
      void import('../pages/PrivacyPolicyPage');
      break;
    case 'terms-of-service':
      void import('../pages/TermsOfServicePage');
      break;
    case 'admin-login':
      void import('../admin/pages/AdminLoginPage');
      break;
    default:
      break;
  }
};

export const prefetchOnIdle = (keys: PrefetchKey[]): void => {
  if (typeof window === 'undefined') return;

  const run = () => {
    keys.forEach((key) => prefetchRoute(key));
  };

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => run(), { timeout: 2000 });
    return;
  }

  globalThis.setTimeout(run, 300);
};
