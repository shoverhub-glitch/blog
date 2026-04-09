import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const rawMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const GA_MEASUREMENT_ID = typeof rawMeasurementId === 'string' ? rawMeasurementId.trim() : '';
const isValidMeasurementId = /^G-[A-Z0-9]{6,}$/i.test(GA_MEASUREMENT_ID)
  && GA_MEASUREMENT_ID.toUpperCase() !== 'G-XXXXXXXXXX';

export const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (!isValidMeasurementId) return;

    // Load GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
    });
  }, []);

  // Track page changes
  useEffect(() => {
    if (!isValidMeasurementId || !window.gtag) return;
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return null;
};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}