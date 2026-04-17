import { useTheme } from '../theme/ThemeContext';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const BlogCardSkeleton = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');

  const shimmer: React.CSSProperties = {
    background: `linear-gradient(90deg, ${theme.colors.surface} 0%, ${theme.colors.surfaceHover} 50%, ${theme.colors.surface} 100%)`,
    backgroundSize: '300% 100%',
    animation: 'skeleton-shimmer 1.8s ease-in-out infinite',
  };

  return (
    <>
      <style>{`@keyframes skeleton-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div style={{
        background: theme.colors.surface,
        borderRadius: '8px',
        overflow: 'hidden',
        border: `1px solid ${theme.colors.border}`,
      }}>
        <div style={{ ...shimmer, height: isMobile ? '180px' : '220px' }} />
        <div style={{ padding: isMobile ? '1.25rem' : '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ ...shimmer, height: '14px', width: '72px', borderRadius: '2px' }} />
          <div style={{ ...shimmer, height: '22px', width: '90%', borderRadius: '3px' }} />
          <div style={{ ...shimmer, height: '22px', width: '70%', borderRadius: '3px' }} />
          <div style={{ ...shimmer, height: '16px', width: '100%', borderRadius: '3px' }} />
          <div style={{ ...shimmer, height: '16px', width: '80%', borderRadius: '3px' }} />
          <div style={{ ...shimmer, height: '16px', width: '60%', borderRadius: '3px' }} />
          <div style={{
            paddingTop: '0.75rem',
            borderTop: `1px solid ${theme.colors.borderLight}`,
            display: 'flex',
            gap: '1rem',
          }}>
            <div style={{ ...shimmer, height: '13px', width: '90px', borderRadius: '2px' }} />
            <div style={{ ...shimmer, height: '13px', width: '70px', borderRadius: '2px' }} />
          </div>
        </div>
      </div>
    </>
  );
};

export const BlogDetailSkeleton = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');

  const shimmer: React.CSSProperties = {
    background: `linear-gradient(90deg, ${theme.colors.surface} 0%, ${theme.colors.surfaceHover} 50%, ${theme.colors.surface} 100%)`,
    backgroundSize: '300% 100%',
    animation: 'skeleton-shimmer 1.8s ease-in-out infinite',
  };

  return (
    <>
      <style>{`@keyframes skeleton-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      {/* Hero area */}
      <div style={{ ...shimmer, height: isMobile ? '250px' : '480px', width: '100%' }} />
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: isMobile ? '1.5rem 1rem' : '3rem 2rem' }}>
        <div style={{ ...shimmer, height: '18px', width: '80px', borderRadius: '2px', marginBottom: '1.5rem' }} />
        {[100, 90, 75].map((w, i) => (
          <div key={i} style={{ ...shimmer, height: i === 0 ? (isMobile ? '24px' : '32px') : '24px', width: `${w}%`, borderRadius: '3px', marginBottom: '0.75rem' }} />
        ))}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {[100, 120, 90, 80].map((w, i) => (
            <div key={i} style={{ ...shimmer, height: '14px', width: `${w}px`, borderRadius: '2px' }} />
          ))}
        </div>
        {[100, 100, 100, 90, 100, 100, 85, 100, 100, 70].map((w, i) => (
          <div key={i} style={{ ...shimmer, height: '16px', width: `${w}%`, borderRadius: '2px', marginBottom: '1.25rem' }} />
        ))}
      </div>
    </>
  );
};