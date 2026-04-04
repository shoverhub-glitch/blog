import { useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { config } from '../config';

interface AdPlaceholderProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
}

function isAdminRoute() {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.startsWith('/admin');
}

export const AdPlaceholder = ({ slot, format = 'auto', className = '' }: AdPlaceholderProps) => {
  const { theme } = useTheme();
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAdminRoute()) return;
    if (adRef.current && !adRef.current.querySelector('ins.adsbygoogle')) {
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', config.adsensePublisherId);
      ins.setAttribute('data-ad-slot', slot);
      ins.setAttribute('data-ad-format', format);
      adRef.current.appendChild(ins);
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // ignore
      }
    }
    const timer = setTimeout(() => {
      if (adRef.current) {
        const ins = adRef.current.querySelector('ins.adsbygoogle');
        if (!ins || ins.childNodes.length === 0) {
          adRef.current.style.display = 'none';
        }
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [slot, format]);

  // Never render on admin
  if (isAdminRoute()) return null;

  return (
    <div
      ref={adRef}
      className={className}
      style={{ minHeight: '100px', marginBottom: theme.spacing.lg, transition: 'all 0.3s ease' }}
    />
  );
};
