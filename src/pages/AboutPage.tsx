import { Link } from 'react-router-dom';
import { ChevronRight, Home, Code, Palette, Zap, Users } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { SEO } from '../components/SEO';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const AboutPage = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');

  const featureCardStyle: React.CSSProperties = {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    padding: '1.5rem',
  };

  return (
    <>
      <SEO
        title="About Us"
        description="Learn about ShoverHub - a digital product studio building apps, websites, and content. Ideas Worth Sharing."
        url="/about"
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
          <li style={{ color: theme.colors.text }}>About</li>
        </ol>
      </nav>

      <article style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: isMobile ? '0.75rem 0.875rem 3rem' : '1rem 1rem 4rem',
        fontFamily: theme.typography.fontFamily,
      }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontFamily: theme.typography.displayFont,
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 700,
            color: theme.colors.text,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}>
            About ShoverHub
          </h1>
          <p style={{
            fontFamily: theme.typography.displayFont,
            fontSize: isMobile ? '1rem' : '1.25rem',
            color: theme.colors.accent,
            fontWeight: 600,
          }}>
            Ideas Worth Sharing
          </p>
        </header>

        <section style={{ marginBottom: '3rem' }}>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.125rem',
            lineHeight: 1.8,
            color: theme.colors.textSecondary,
            marginBottom: '1.5rem',
          }}>
            ShoverHub is a modern digital product studio dedicated to building innovative applications, 
            websites, and digital tools. We believe in the power of technology to solve real problems 
            and create meaningful experiences.
          </p>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.125rem',
            lineHeight: 1.8,
            color: theme.colors.textSecondary,
          }}>
            This blog is where we share our insights, tutorials, and stories from our journey of building 
            digital products. From technical deep-dives to design thinking, we document everything we learn 
            along the way.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: theme.typography.displayFont,
            fontSize: isMobile ? '1.375rem' : '1.75rem',
            fontWeight: 700,
            color: theme.colors.text,
            marginBottom: '1.5rem',
          }}>
            What We Do
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div style={featureCardStyle}>
              <Code size={32} color={theme.colors.accent} style={{ marginBottom: '1rem' }} />
              <h3 style={{
                fontFamily: theme.typography.displayFont,
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: theme.colors.text,
              }}>
                App Development
              </h3>
              <p style={{ fontSize: '0.9375rem', color: theme.colors.textSecondary, lineHeight: 1.6 }}>
                Building mobile applications that solve real problems and delight users.
              </p>
            </div>

            <div style={featureCardStyle}>
              <Palette size={32} color={theme.colors.accent} style={{ marginBottom: '1rem' }} />
              <h3 style={{
                fontFamily: theme.typography.displayFont,
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: theme.colors.text,
              }}>
                Web Design
              </h3>
              <p style={{ fontSize: '0.9375rem', color: theme.colors.textSecondary, lineHeight: 1.6 }}>
                Creating beautiful, functional websites that provide excellent user experiences.
              </p>
            </div>

            <div style={featureCardStyle}>
              <Zap size={32} color={theme.colors.accent} style={{ marginBottom: '1rem' }} />
              <h3 style={{
                fontFamily: theme.typography.displayFont,
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: theme.colors.text,
              }}>
                Content Creation
              </h3>
              <p style={{ fontSize: '0.9375rem', color: theme.colors.textSecondary, lineHeight: 1.6 }}>
                Sharing knowledge through tutorials, insights, and technical articles.
              </p>
            </div>

            <div style={featureCardStyle}>
              <Users size={32} color={theme.colors.accent} style={{ marginBottom: '1rem' }} />
              <h3 style={{
                fontFamily: theme.typography.displayFont,
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: theme.colors.text,
              }}>
                Digital Tools
              </h3>
              <p style={{ fontSize: '0.9375rem', color: theme.colors.textSecondary, lineHeight: 1.6 }}>
                Building tools that help developers and creators work more efficiently.
              </p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: theme.typography.displayFont,
            fontSize: isMobile ? '1.375rem' : '1.75rem',
            fontWeight: 700,
            color: theme.colors.text,
            marginBottom: '1.5rem',
          }}>
            Our Mission
          </h2>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.125rem',
            lineHeight: 1.8,
            color: theme.colors.textSecondary,
            marginBottom: '1.5rem',
          }}>
            At ShoverHub, we believe that in an age of information overload, the value of curation has never been higher. 
            Our mission is to provide a sanctuary for thoughtful readers who seek depth, nuance, and perspective in their daily consumption.
          </p>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.125rem',
            lineHeight: 1.8,
            color: theme.colors.textSecondary,
          }}>
            We focus on <strong style={{ color: theme.colors.text }}>quality over quantity</strong>, 
            crafting content that informs, inspires, and creates genuine value for our audience.
          </p>
        </section>

        <section style={{
          background: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.lg,
          padding: isMobile ? '1.5rem' : '2rem',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontFamily: theme.typography.displayFont,
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            fontWeight: 700,
            color: theme.colors.text,
            marginBottom: '1rem',
          }}>
            Want to Connect?
          </h2>
          <p style={{
            fontSize: '1rem',
            color: theme.colors.textSecondary,
            marginBottom: '1.5rem',
          }}>
            We'd love to hear from you. Whether you have a question, feedback, or just want to say hi.
          </p>
          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              borderRadius: theme.borderRadius.md,
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'opacity 0.2s',
            }}
          >
            Get in Touch
          </Link>
        </section>
      </article>
    </>
  );
};
