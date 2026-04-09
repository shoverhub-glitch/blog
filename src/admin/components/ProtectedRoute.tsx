import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useTheme } from '../../theme/ThemeContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAdmin, loading } = useAdminAuth();
  const { theme } = useTheme();

  if (loading) {
    const containerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
    };

    return (
      <div style={containerStyle}>
        <div style={{ color: theme.colors.textMuted }}>Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/shover-admin/login" replace />;
  }

  return <>{children}</>;
};
