import { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Cookie } from 'lucide-react';

export const CookieConsent = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: isMobile ? '1rem' : '1.25rem',
        background: theme.colors.surface,
        borderTop: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.xl,
        zIndex: 9999,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '1rem' : 0,
        maxWidth: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, maxWidth: isMobile ? '100%' : '700px' }}>
        <Cookie size={20} color={theme.colors.accent} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: isMobile ? '0.875rem' : '0.9375rem',
            color: theme.colors.text,
            margin: 0,
            lineHeight: 1.5,
          }}>
            We use cookies and similar technologies to enhance your experience. By continuing to visit this site you agree to our use of cookies as described in our{' '}
            <a
              href="/privacy-policy"
              style={{
                color: theme.colors.accent,
                textDecoration: 'underline',
              }}
            >
              Privacy Policy
            </a>.
          </p>
          <p style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: '0.8125rem',
            color: theme.colors.textMuted,
            margin: '0.5rem 0 0',
          }}>
            Some cookies are used for personalized ads delivered by Google AdSense.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
        <button
          onClick={handleDecline}
          style={{
            padding: isMobile ? '0.5rem 1rem' : '0.625rem 1.25rem',
            fontSize: '0.875rem',
            fontFamily: theme.typography.fontFamily,
            fontWeight: 500,
            color: theme.colors.textSecondary,
            background: 'transparent',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = theme.colors.background;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          style={{
            padding: isMobile ? '0.5rem 1rem' : '0.625rem 1.25rem',
            fontSize: '0.875rem',
            fontFamily: theme.typography.fontFamily,
            fontWeight: 600,
            color: theme.colors.background,
            background: theme.colors.text,
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
};