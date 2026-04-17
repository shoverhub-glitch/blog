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
  return window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/shover-admin');
}

function shouldDisableAds() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1';
  const isTestClient = config.adsensePublisherId === 'ca-pub-3940256099942544';
  return isLocalHost || isTestClient;
}

export const AdPlaceholder = ({ slot, format = 'auto', className = '' }: AdPlaceholderProps) => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const adRef = useRef<HTMLDivElement>(null);
  const [shouldLoadAd, setShouldLoadAd] = useState(false);
  const [hasAdContent, setHasAdContent] = useState(false);
  const [adCheckDone, setAdCheckDone] = useState(false);
  const adsDisabled = shouldDisableAds();

  useEffect(() => {
    if (isAdminRoute()) return;
    if (adsDisabled) return;
    if (!adRef.current || shouldLoadAd) return;

    if (typeof window.IntersectionObserver === 'undefined') {
      setShouldLoadAd(true);
      return;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadAd(true);
          observer.disconnect();
        }
      },
      { rootMargin: '350px 0px' }
    );

    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, [shouldLoadAd, adsDisabled]);

  useEffect(() => {
    if (isAdminRoute()) return;
    if (adsDisabled) return;
    if (!shouldLoadAd) return;

    setAdCheckDone(false);

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
      try {
        // @ts-expect-error - adsbygoogle may not be defined
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        setHasAdContent(false);
      }
    }

    const timer = setTimeout(() => {
      if (adRef.current) {
        const ins = adRef.current.querySelector('ins.adsbygoogle');
        if (!ins || ins.clientHeight === 0 || ins.childNodes.length === 0) {
          setHasAdContent(false);
          setAdCheckDone(true);
          return;
        }
        setHasAdContent(true);
        setAdCheckDone(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [slot, format, isMobile, shouldLoadAd, adsDisabled]);

  if (isAdminRoute() || adsDisabled) return null;

  return (
    <div
      ref={adRef}
      className={className}
      style={{ 
        marginBottom: hasAdContent ? theme.spacing.lg : 0,
        transition: 'all 0.3s ease',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        minHeight: shouldLoadAd && !hasAdContent && !adCheckDone ? (isMobile ? '90px' : '60px') : 0,
      }}
    />
  );
};
