import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const Footer = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');

  const linkStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
    textDecoration: 'none',
    fontSize: isMobile ? '0.9375rem' : '0.875rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  };

  const padding = isMobile ? '2rem 1rem' : '3rem 2rem';
  const bottomPadding = isMobile ? '1rem' : '1.25rem';

  return (
    <footer style={{
      borderTop: `1px solid ${theme.colors.border}`,
      background: theme.colors.surface,
      fontFamily: theme.typography.fontFamily,
      width: '100%',
      overflow: 'hidden',
    }}>
      {/* Top section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: padding,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: isMobile ? '1.5rem' : '3rem',
        borderBottom: `1px solid ${theme.colors.borderLight}`,
      }}>
        {/* Brand */}
        <div>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: theme.typography.displayFont,
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              fontWeight: 700,
              color: theme.colors.text,
              letterSpacing: '-0.02em',
            }}>
              Shover<span style={{ color: theme.colors.accent }}>Hub</span>
            </span>
          </Link>
          <p style={{
            color: theme.colors.textMuted,
            fontSize: '0.875rem',
            lineHeight: 1.7,
            marginTop: '0.75rem',
            maxWidth: '280px',
          }}>
            Building apps, websites & content. Ideas Worth Sharing.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: theme.colors.text,
            marginBottom: '0.75rem',
          }}>
            Quick Links
          </h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/categories" style={linkStyle}>Categories</Link>
            <Link to="/about" style={linkStyle}>About</Link>
            <Link to="/contact" style={linkStyle}>Contact</Link>
          </nav>
        </div>

        {/* Legal */}
        <div>
          <h4 style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: theme.colors.text,
            marginBottom: '0.75rem',
          }}>
            Legal
          </h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/privacy-policy" style={linkStyle}>Privacy Policy</Link>
            <Link to="/terms-of-service" style={linkStyle}>Terms of Service</Link>
            <a href="https://shoverhub.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>Main Site</a>
          </nav>
        </div>

        {/* Connect */}
        <div>
          <h4 style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: theme.colors.text,
            marginBottom: '0.75rem',
          }}>
            Connect
          </h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="https://twitter.com/shoverhub" target="_blank" rel="noopener noreferrer" style={linkStyle}>Twitter</a>
            <a href="https://github.com/shoverhub" target="_blank" rel="noopener noreferrer" style={linkStyle}>GitHub</a>
            <a href="mailto:contact@shoverhub.com" style={linkStyle}>Email Us</a>
          </nav>
        </div>
      </div>

      {/* Bottom section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${bottomPadding} ${isMobile ? '1rem' : '2rem'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
        textAlign: 'center',
      }}>
        <p style={{ color: theme.colors.textMuted, fontSize: '0.75rem', margin: 0 }}>
          © {new Date().getFullYear()} ShoverHub. All rights reserved.
        </p>
        <span style={{ color: theme.colors.textMuted, margin: '0 0.25rem' }}>·</span>
        <a href="https://shoverhub.com" target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent, textDecoration: 'none', fontSize: '0.75rem' }}>
          shoverhub.com
        </a>
      </div>
    </footer>
  );
};
