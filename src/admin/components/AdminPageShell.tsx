import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface AdminPageShellProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  backTo?: string;
  backLabel?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const AdminPageShell = ({
  title,
  subtitle,
  action,
  backTo,
  backLabel = 'Back',
  children,
  maxWidth = '1280px',
}: AdminPageShellProps) => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');

  const shellStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: `radial-gradient(circle at top right, ${theme.colors.accentLight} 0%, transparent 35%), ${theme.colors.background}`,
    padding: isMobile 
      ? theme.spacing.xs
      : `${theme.spacing.lg} ${theme.spacing.sm} ${theme.spacing.xl}`,
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: isMobile ? theme.spacing.md : theme.spacing.xl,
    padding: isMobile ? theme.spacing.sm : `${theme.spacing.lg} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    boxShadow: theme.shadows.sm,
  };

  const titleStyle: React.CSSProperties = {
    margin: `${theme.spacing.xs} 0 0`,
    color: theme.colors.text,
    fontFamily: theme.typography.displayFont,
    fontSize: isMobile ? '1.1rem' : 'clamp(1.6rem, 3vw, 2.4rem)',
    lineHeight: theme.typography.lineHeight.tight,
  };

  return (
    <div style={shellStyle}>
      <div style={{ maxWidth, margin: '0 auto' }}>
        <header style={headerStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: theme.spacing.md,
              flexWrap: 'wrap',
            }}
          >
            <div>
              {backTo && (
                <Link
                  to={backTo}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    color: theme.colors.textMuted,
                    fontSize: theme.typography.fontSize.sm,
                    marginBottom: theme.spacing.sm,
                    textDecoration: 'none',
                  }}
                >
                  <ChevronLeft size={16} />
                  {backLabel}
                </Link>
              )}

              <p
                style={{
                  fontSize: isMobile ? '0.6rem' : '0.72rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: theme.colors.textMuted,
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                Admin Console
              </p>
              <h1 style={titleStyle}>
                {title}
              </h1>
              {subtitle && (
                <p
                  style={{
                    margin: isMobile ? `${theme.spacing.xs} 0 0` : `${theme.spacing.sm} 0 0`,
                    color: theme.colors.textSecondary,
                    fontSize: isMobile ? theme.typography.fontSize.xxs : theme.typography.fontSize.sm,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {action && (
              <div style={{ 
                marginTop: isMobile ? theme.spacing.sm : 0,
                width: isMobile ? '100%' : 'auto',
              }}>
                {action}
              </div>
            )}
          </div>
        </header>

        {children}
      </div>
    </div>
  );
};
