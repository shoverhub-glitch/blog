import { memo, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { withAlpha } from '../theme/theme';
import { prefetchRoute } from '../utils/prefetch';

export const Header = memo(() => {
  const { theme, mode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window === 'undefined' ? 1280 : window.innerWidth));
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = viewportWidth <= 768;
  const isTablet = viewportWidth <= 1024;

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const headerPadding = isMobile ? '0.5rem 1rem' : isTablet ? '0.75rem 1.5rem' : '0.375rem 2rem';
  const navPadding = isMobile ? '0 1rem' : isTablet ? '0 1.5rem' : '0 2rem';
  const iconButtonSize = isMobile ? '44px' : '36px';
  const scrolledBackground = withAlpha(theme.colors.background, 0.95);

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled
          ? scrolledBackground
          : 'var(--color-background)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--color-border)' : 'var(--color-border-light)'}`,
        transition: 'all 0.3s ease',
        width: '100%',
        overflow: 'hidden',
      }}>
        {/* Top editorial bar - hidden on mobile */}
        {!isMobile && (
          <div style={{
            borderBottom: '1px solid var(--color-border-light)',
            padding: headerPadding,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{
              fontSize: '0.6875rem',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
            }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span style={{
              fontSize: '0.6875rem',
              color: 'var(--color-accent)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
            }}>
              The Modern Journal
            </span>
          </div>
        )}

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: navPadding,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: isMobile ? '60px' : '72px',
          gap: '1rem',
        }}>
          {/* Logo */}
          <Link to="/" style={{
            fontFamily: 'var(--font-display)',
            fontSize: isMobile ? '1.35rem' : '1.75rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}>
            shover<span style={{ color: 'var(--color-accent)' }}>Hub</span>
          </Link>

          {/* Desktop Nav - hidden on mobile/tablet */}
          {!isTablet && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <Link to="/" className="nav-link" onMouseEnter={() => prefetchRoute('home')} onFocus={() => prefetchRoute('home')}>Home</Link>
              <Link to="/categories" className="nav-link" onMouseEnter={() => prefetchRoute('categories')} onFocus={() => prefetchRoute('categories')}>Categories</Link>
            </nav>
          )}

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Search toggle */}
            <button
              className="icon-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
              style={{ width: iconButtonSize, height: iconButtonSize }}
            >
              {isSearchOpen ? <X size={16} /> : <Search size={16} />}
            </button>

            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme" style={{ width: iconButtonSize, height: iconButtonSize }}>
              {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Mobile menu toggle - visible on tablet and below */}
            <button
              className="icon-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
              style={{ width: iconButtonSize, height: iconButtonSize, display: isTablet ? 'flex' : 'none' }}
            >
              {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {isSearchOpen && (
          <div style={{
            borderTop: '1px solid var(--color-border)',
            padding: '1rem',
            background: 'var(--color-surface)',
            animation: 'slideDown 0.2s ease',
          }}>
            <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
              <Search size={18} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                pointerEvents: 'none',
              }} />
              <input
                className="search-input-main"
                autoFocus
                type="text"
                placeholder="Search articles, topics…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: isMobile ? '0.75rem 2.5rem 0.75rem 2.25rem' : '0.875rem 3rem',
                  background: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  color: 'var(--color-text)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-body)',
                  boxSizing: 'border-box',
                }}
              />
            </form>
          </div>
        )}
      </header>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'var(--color-background)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease',
          overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text)' }}>
              shover<span style={{ color: 'var(--color-accent)' }}>Hub</span>
            </span>
            <button className="icon-btn" onClick={() => setIsMenuOpen(false)} style={{ width: iconButtonSize, height: iconButtonSize }}>
              <X size={20} />
            </button>
          </div>
          <nav style={{ flex: 1 }}>
            <Link to="/" className="mobile-nav-link" onMouseEnter={() => prefetchRoute('home')} onFocus={() => prefetchRoute('home')} onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/categories" className="mobile-nav-link" onMouseEnter={() => prefetchRoute('categories')} onFocus={() => prefetchRoute('categories')} onClick={() => setIsMenuOpen(false)}>Categories</Link>
            <Link to="/about" className="mobile-nav-link" onMouseEnter={() => prefetchRoute('about')} onFocus={() => prefetchRoute('about')} onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/contact" className="mobile-nav-link" onMouseEnter={() => prefetchRoute('contact')} onFocus={() => prefetchRoute('contact')} onClick={() => setIsMenuOpen(false)}>Contact</Link>
          </nav>
          <form onSubmit={handleSearch} style={{ position: 'relative', marginTop: '1rem' }}>
            <input
              className="search-input-main"
              type="text"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                color: 'var(--color-text)',
                fontSize: '1rem',
                fontFamily: 'var(--font-body)',
                boxSizing: 'border-box',
              }}
            />
          </form>
        </div>
      )}
    </>
  );
});
