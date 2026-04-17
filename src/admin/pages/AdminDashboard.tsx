import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminSEO } from '../components/AdminSEO';
import { LogOut, Plus, FileText, Tag, MessageCircle } from 'lucide-react';
import { AdminPageShell } from '../components/AdminPageShell';

export const AdminDashboard = () => {
  const { theme } = useTheme();
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate('/shover-admin/login');
    } catch (error) {
      console.error('Sign out failed:', error);
      setSigningOut(false);
    }
  };

  const userInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
  };

  const userEmailStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  };

  const signOutButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.accent}33`,
    backgroundColor: theme.colors.accentLight,
    color: theme.colors.accent,
    cursor: signingOut ? 'not-allowed' : 'pointer',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    opacity: signingOut ? 0.6 : 1,
    transition: 'all 0.2s',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing['3xl'],
  };

  const cardStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
    transition: 'all 0.3s ease',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.accentLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.accent,
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  };

  const cardDescStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed,
  };

  return (
    <>
      <AdminSEO title="Dashboard" />
      <AdminPageShell
        title="Dashboard"
        subtitle="Manage content, categories, and publishing workflow in one place."
        action={
          <div style={userInfoStyle}>
            <div>
              <div style={userEmailStyle}>{user?.email}</div>
            </div>
            <button
              onClick={handleSignOut}
              style={signOutButtonStyle}
              disabled={signingOut}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        }
      >

        <div style={gridStyle} className="admin-dashboard-grid">
          <Link
            to="/shover-admin/blogs"
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={iconContainerStyle}>
              <FileText size={24} />
            </div>
            <div>
              <h2 style={cardTitleStyle}>Manage Blogs</h2>
              <p style={cardDescStyle}>View, edit, and delete blog posts</p>
            </div>
          </Link>

          <Link
            to="/shover-admin/blogs/new"
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={iconContainerStyle}>
              <Plus size={24} />
            </div>
            <div>
              <h2 style={cardTitleStyle}>Create Blog</h2>
              <p style={cardDescStyle}>Write and publish new articles</p>
            </div>
          </Link>

          <Link
            to="/shover-admin/categories"
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={iconContainerStyle}>
              <Tag size={24} />
            </div>
            <div>
              <h2 style={cardTitleStyle}>Manage Categories</h2>
              <p style={cardDescStyle}>Add, edit, or remove blog categories</p>
            </div>
          </Link>

          <Link
            to="/shover-admin/comments"
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={iconContainerStyle}>
              <MessageCircle size={24} />
            </div>
            <div>
              <h2 style={cardTitleStyle}>Manage Comments</h2>
              <p style={cardDescStyle}>Review, approve, or delete comments</p>
            </div>
          </Link>


        </div>
      </AdminPageShell>
    </>
  );
};
