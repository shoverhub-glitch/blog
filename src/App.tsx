import { lazy, memo, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Analytics } from './components/Analytics';
import { CookieConsent } from './components/CookieConsent';
import { prefetchOnIdle } from './utils/prefetch';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage').then(m => ({ default: m.BlogDetailPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));

const AdminLoginPage = lazy(() => import('./admin/pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminBlogsPage = lazy(() => import('./admin/pages/AdminBlogsPage').then(m => ({ default: m.AdminBlogsPage })));
const AdminBlogEditorPage = lazy(() => import('./admin/pages/AdminBlogEditorPage').then(m => ({ default: m.AdminBlogEditorPage })));
const AdminCategoriesPage = lazy(() => import('./admin/pages/AdminCategoriesPage').then(m => ({ default: m.AdminCategoriesPage })));
const AdminCommentsPage = lazy(() => import('./admin/pages/AdminCommentsPage').then(m => ({ default: m.AdminCommentsPage })));


const LoadingFallback = () => (
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: 'var(--color-background)'
  }}>
    <div className="skeleton-wrapper">
      <div className="sk-skeleton" style={{ height: '180px', marginBottom: '1rem' }} />
      <div className="sk-skeleton" style={{ height: '14px', width: '60px', marginBottom: '0.75rem' }} />
      <div className="sk-skeleton" style={{ height: '20px', width: '90%', marginBottom: '0.5rem' }} />
      <div className="sk-skeleton" style={{ height: '20px', width: '75%', marginBottom: '0.5rem' }} />
      <div className="sk-skeleton" style={{ height: '14px', width: '100%', marginBottom: '0.5rem' }} />
      <div className="sk-skeleton" style={{ height: '14px', width: '85%', marginBottom: '0.5rem' }} />
    </div>
  </div>
);

const PublicLayout = memo(() => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Header />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </div>
));

function App() {
  useEffect(() => {
    prefetchOnIdle(['search', 'categories', 'about', 'contact']);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AdminAuthProvider>
          <Router>
            <Analytics />
            <CookieConsent />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/shover-admin/login" element={<AdminLoginPage />} />
                <Route path="/shover-admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/shover-admin/blogs" element={<ProtectedRoute><AdminBlogsPage /></ProtectedRoute>} />
                <Route path="/shover-admin/blogs/new" element={<ProtectedRoute><AdminBlogEditorPage /></ProtectedRoute>} />
                <Route path="/shover-admin/blogs/:id/edit" element={<ProtectedRoute><AdminBlogEditorPage /></ProtectedRoute>} />
                <Route path="/shover-admin/categories" element={<ProtectedRoute><AdminCategoriesPage /></ProtectedRoute>} />
                <Route path="/shover-admin/comments" element={<ProtectedRoute><AdminCommentsPage /></ProtectedRoute>} />

                <Route path="/shover-admin" element={<Navigate to="/shover-admin/dashboard" replace />} />

                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/blog/:slug" element={<BlogDetailPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </AdminAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
