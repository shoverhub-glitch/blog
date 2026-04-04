import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { prefetchOnIdle, prefetchRoute } from '../utils/prefetch';

export const Header = () => {
  const { theme, mode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

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

  useEffect(() => {
    prefetchOnIdle(['categories', 'search', 'about', 'contact']);
  }, []);

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

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          color: ${theme.colors.textMuted};
          text-decoration: none;
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.2s;
          font-family: ${theme.typography.fontFamily};
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: ${theme.colors.accent};
          transition: width 0.3s ease;
        }
        .nav-link:hover {
          color: ${theme.colors.text};
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${iconButtonSize};
          height: ${iconButtonSize};
          border-radius: 50%;
          border: 1px solid ${theme.colors.border};
          background: transparent;
          color: ${theme.colors.textMuted};
          cursor: pointer;
          transition: all 0.2s;
        }
        .icon-btn:hover {
          background: ${theme.colors.surface};
          color: ${theme.colors.text};
          border-color: ${theme.colors.text};
        }
        .search-input-main::placeholder {
          color: ${theme.colors.textMuted};
        }
        .search-input-main:focus {
          outline: none;
        }
        .mobile-nav-link {
          display: block;
          color: ${theme.colors.text};
          text-decoration: none;
          font-size: clamp(1.2rem, 6vw, 1.75rem);
          font-weight: 700;
          font-family: ${theme.typography.displayFont};
          padding: 0.75rem 0;
          border-bottom: 1px solid ${theme.colors.borderLight};
          transition: color 0.2s, transform 0.2s;
        }
        .mobile-nav-link:hover {
          color: ${theme.colors.accent};
          transform: translateX(8px);
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled
          ? mode === 'dark'
            ? 'rgba(12,12,11,0.95)'
            : 'rgba(250,250,248,0.95)'
          : theme.colors.background,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: `1px solid ${scrolled ? theme.colors.border : theme.colors.borderLight}`,
        transition: 'all 0.3s ease',
        width: '100%',
        overflow: 'hidden',
      }}>
        {/* Top editorial bar - hidden on mobile */}
        {!isMobile && (
          <div style={{
            borderBottom: `1px solid ${theme.colors.borderLight}`,
            padding: headerPadding,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{
              fontSize: '0.6875rem',
              color: theme.colors.textMuted,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: theme.typography.fontFamily,
            }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span style={{
              fontSize: '0.6875rem',
              color: theme.colors.accent,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: theme.typography.fontFamily,
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
            fontFamily: theme.typography.displayFont,
            fontSize: isMobile ? '1.35rem' : '1.75rem',
            fontWeight: 700,
            color: theme.colors.text,
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}>
            shover<span style={{ color: theme.colors.accent }}>Hub</span>
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
            borderTop: `1px solid ${theme.colors.border}`,
            padding: '1rem',
            background: theme.colors.surface,
            animation: 'slideDown 0.2s ease',
          }}>
            <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
              <Search size={18} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: theme.colors.textMuted,
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
                  background: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '4px',
                  color: theme.colors.text,
                  fontSize: '1rem',
                  fontFamily: theme.typography.fontFamily,
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
          background: theme.colors.background,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease',
          overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <span style={{ fontFamily: theme.typography.displayFont, fontSize: '1.35rem', fontWeight: 700, color: theme.colors.text }}>
              shover<span style={{ color: theme.colors.accent }}>Hub</span>
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
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '4px',
                color: theme.colors.text,
                fontSize: '1rem',
                fontFamily: theme.typography.fontFamily,
                boxSizing: 'border-box',
              }}
            />
          </form>
        </div>
      )}
    </>
  );
};
