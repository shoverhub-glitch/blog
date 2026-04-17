import { Link } from 'react-router-dom';
import { ChevronRight, Home, Mail, Globe, MessageCircle } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { SEO } from '../components/SEO';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const ContactPage = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');

  const containerStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: isMobile ? '0.75rem 0.875rem 3rem' : '1rem 1rem 4rem',
  };

  const cardStyle: React.CSSProperties = {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    padding: '2rem',
  };

  const contactInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem 0',
    borderBottom: `1px solid ${theme.colors.border}`,
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with the ShoverHub team. We'd love to hear from you about our blog, products, or any questions you have."
        url="/contact"
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: isMobile ? '0.75rem 0.875rem' : '1rem',
      }}>
        <ol style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontSize: '0.875rem',
          fontFamily: theme.typography.fontFamily,
        }}>
          <li><Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: theme.colors.textMuted }}><Home size={14} /> Home</Link></li>
          <li style={{ color: theme.colors.textMuted }}><ChevronRight size={14} /></li>
          <li style={{ color: theme.colors.text }}>Contact</li>
        </ol>
      </nav>

      <div style={containerStyle}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: theme.typography.displayFont,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            color: theme.colors.text,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}>
            Get in Touch
          </h1>
          <p style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: isMobile ? '1rem' : '1.125rem',
            color: theme.colors.textSecondary,
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            Have a question or feedback? We'd love to hear from you. Click the button below to send us an email.
          </p>
        </header>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ ...cardStyle, textAlign: 'center' }}>
            <a
              href="mailto:contact@shoverhub.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                fontSize: '1.125rem',
                fontWeight: 600,
                borderRadius: theme.borderRadius.md,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              <Mail size={24} />
              Send us an Email
            </a>
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <div style={cardStyle}>
            <h2 style={{
              fontFamily: theme.typography.displayFont,
              fontSize: isMobile ? '1.125rem' : '1.25rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: theme.colors.text,
            }}>
              Contact Information
            </h2>

            <div style={contactInfoStyle}>
              <Mail size={20} color={theme.colors.accent} />
              <div>
                <p style={{ fontWeight: 500, marginBottom: '0.25rem', color: theme.colors.text }}>Email</p>
                <a href="mailto:contact@shoverhub.com" style={{ color: theme.colors.accent, textDecoration: 'none' }}>
                  contact@shoverhub.com
                </a>
              </div>
            </div>

            <div style={contactInfoStyle}>
              <Globe size={20} color={theme.colors.accent} />
              <div>
                <p style={{ fontWeight: 500, marginBottom: '0.25rem', color: theme.colors.text }}>Website</p>
                <a href="https://shoverhub.com" target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent, textDecoration: 'none' }}>
                  shoverhub.com
                </a>
              </div>
            </div>

            <div style={{ ...contactInfoStyle, borderBottom: 'none' }}>
              <MessageCircle size={20} color={theme.colors.accent} />
              <div>
                <p style={{ fontWeight: 500, marginBottom: '0.25rem', color: theme.colors.text }}>Social Media</p>
                <a href="https://twitter.com/shoverhub" target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent, textDecoration: 'none' }}>
                  @shoverhub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};