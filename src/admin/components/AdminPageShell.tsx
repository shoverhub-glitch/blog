import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `radial-gradient(circle at top right, ${theme.colors.accentLight} 0%, transparent 35%), ${theme.colors.background}`,
        padding: `${theme.spacing.xl} ${theme.spacing.md} ${theme.spacing['2xl']}`,
      }}
    >
      <div style={{ maxWidth, margin: '0 auto' }}>
        <header
          style={{
            marginBottom: theme.spacing.xl,
            padding: `${theme.spacing.lg} ${theme.spacing.lg}`,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.surface,
            boxShadow: theme.shadows.sm,
          }}
        >
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
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: theme.colors.textMuted,
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                Admin Console
              </p>
              <h1
                style={{
                  margin: `${theme.spacing.xs} 0 0`,
                  color: theme.colors.text,
                  fontFamily: theme.typography.displayFont,
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  lineHeight: theme.typography.lineHeight.tight,
                }}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  style={{
                    margin: `${theme.spacing.sm} 0 0`,
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.sm,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {action}
          </div>
        </header>

        {children}
      </div>
    </div>
  );
};
