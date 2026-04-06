import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
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
  const isMobile = useMediaQuery('(max-width: 640px)');
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isAdminRoute()) return;
    if (adRef.current && !adRef.current.querySelector('ins.adsbygoogle')) {
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', config.adsensePublisherId);
      ins.setAttribute('data-ad-slot', slot);
      ins.setAttribute('data-ad-format', 'auto');
      if (isMobile) {
        ins.style.width = '100%';
        ins.style.minHeight = '90px';
        ins.style.maxWidth = '100%';
      }
      adRef.current.appendChild(ins);
      setIsVisible(true);
      try {
        // @ts-expect-error - adsbygoogle may not be defined
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        setIsVisible(false);
      }
    }
    const timer = setTimeout(() => {
      if (adRef.current) {
        const ins = adRef.current.querySelector('ins.adsbygoogle');
        if (!ins || ins.clientHeight === 0 || ins.childNodes.length === 0) {
          adRef.current.style.display = 'none';
          setIsVisible(false);
        }
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [slot, format, isMobile]);

  if (isAdminRoute()) return null;
  if (!isVisible) return null;

  return (
    <div
      ref={adRef}
      className={className}
      style={{ 
        marginBottom: theme.spacing.lg, 
        transition: 'all 0.3s ease',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    />
  );
};
