import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { AdminSEO } from '../components/AdminSEO';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AlertCircle, Loader, ExternalLink, Eye, EyeOff } from 'lucide-react';

export const AdminLoginPage = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { signIn, error: authError } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/shover-admin/dashboard');
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: `radial-gradient(circle at top right, ${theme.colors.accentLight} 0%, transparent 38%), ${theme.colors.background}`,
    padding: isMobile ? theme.spacing.sm : theme.spacing.lg,
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: isMobile ? '100%' : '440px',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    padding: isMobile ? theme.spacing.md : theme.spacing['2xl'],
    boxShadow: theme.shadows.lg,
    position: 'relative',
  };

  const viewSiteStyle: React.CSSProperties = {
    position: 'absolute',
    top: isMobile ? theme.spacing.xs : theme.spacing.md,
    right: isMobile ? theme.spacing.xs : theme.spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: 'transparent',
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSize.xxs,
    fontWeight: 500,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? '1.5rem' : 'clamp(1.8rem, 4vw, 2.4rem)',
    fontWeight: theme.typography.fontWeight.bold,
    fontFamily: theme.typography.displayFont,
    color: theme.colors.text,
    marginBottom: isMobile ? theme.spacing.sm : theme.spacing.md,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.tight,
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: isMobile ? theme.spacing.md : theme.spacing.lg,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: isMobile ? theme.typography.fontSize.xxs : theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: isMobile ? theme.spacing.xs : `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: isMobile ? theme.typography.fontSize.sm : theme.typography.fontSize.base,
    outline: 'none',
    transition: 'all 0.2s',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: isMobile ? theme.spacing.sm : `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    border: 'none',
    backgroundColor: theme.colors.accent,
    color: theme.colors.background,
    fontSize: isMobile ? theme.typography.fontSize.sm : theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    transition: 'all 0.2s',
  };

  const errorStyle: React.CSSProperties = {
    backgroundColor: theme.colors.errorLight,
    border: `1px solid ${theme.colors.error}`,
    color: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing.lg,
  };

  const displayError = error || authError;

  return (
    <>
      <AdminSEO title="Login" />
      <div style={containerStyle}>
      <div style={cardStyle}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={viewSiteStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.colors.accent;
            e.currentTarget.style.borderColor = theme.colors.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme.colors.textMuted;
            e.currentTarget.style.borderColor = theme.colors.border;
          }}
        >
          <ExternalLink size={14} />
          View Site
        </a>

        <p style={{
          fontSize: '0.72rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: theme.colors.textMuted,
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: theme.spacing.xl,
        }}>
          Admin Console
        </p>
        <h1 style={titleStyle}>Login</h1>

        {displayError && (
          <div style={errorStyle}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              disabled={loading}
              required
              autoComplete="email"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '40px' }}
                disabled={loading}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: theme.spacing.sm,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme.colors.textMuted,
                  padding: theme.spacing.xs,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? (
              <>
                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
    </>
  );
};
