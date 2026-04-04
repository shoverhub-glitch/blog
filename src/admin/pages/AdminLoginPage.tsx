import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import { AdminSEO } from '../components/AdminSEO';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AlertCircle, Loader } from 'lucide-react';

export const AdminLoginPage = () => {
  const { theme } = useTheme();
  const { signIn, error: authError } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/shover-admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
    padding: theme.spacing.lg,
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    padding: theme.spacing['2xl'],
    boxShadow: theme.shadows.lg,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
    fontWeight: theme.typography.fontWeight.bold,
    fontFamily: theme.typography.displayFont,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.tight,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing['2xl'],
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: theme.spacing.lg,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    outline: 'none',
    transition: 'all 0.2s',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    border: 'none',
    backgroundColor: theme.colors.accent,
    color: '#ffffff',
    fontSize: theme.typography.fontSize.base,
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
    backgroundColor: '#fee2e2',
    border: `1px solid #fca5a5`,
    color: '#991b1b',
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
        <p style={{
          fontSize: '0.72rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: theme.colors.textMuted,
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: theme.spacing.sm,
        }}>
          Admin Console
        </p>
        <h1 style={titleStyle}>ShoverHub Admin</h1>
        <p style={subtitleStyle}>Sign in to manage the blog</p>

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
              placeholder="admin@shoverhub.com"
              style={inputStyle}
              disabled={loading}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              disabled={loading}
              required
            />
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
