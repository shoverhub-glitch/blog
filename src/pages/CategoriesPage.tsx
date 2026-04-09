import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Home } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { blogService } from '../services/blogService';
import { Category } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { createCategorySchema } from '../utils/seoSchemas';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { getCategoryColors } from '../theme/theme';

export const CategoriesPage = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      const cats = await blogService.getAllCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .cat-card { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; }
        .cat-card:hover { transform: translateY(-8px) scale(1.01); }
        .cat-card:hover .cat-arrow { opacity: 1; transform: translate(0, 0) rotate(0deg); }
        .cat-card:hover .cat-number { transform: scale(1.15); }
        .cat-arrow { transition: all 0.3s ease; opacity: 0; transform: translate(-6px, 6px) rotate(-10deg); }
        .cat-number { transition: transform 0.35s ease; display: block; font-family: '${theme.typography.displayFont}'; font-size: ${isMobile ? '2.5rem' : '4rem'}; font-weight: 900; opacity: 0.12; line-height: 1; margin-bottom: 0.5rem; }
      `}</style>

      <SEO
        title="Categories"
        description="Browse all article categories on ShoverHub. Explore our curated collection of tutorials, insights, and stories organized by topic. Ideas Worth Sharing."
        url="/categories"
        jsonLd={createCategorySchema('Categories', 'Browse all article categories on ShoverHub.')}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '1rem' : '1rem 2rem',
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
          <li style={{ color: theme.colors.text }}>Categories</li>
        </ol>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '2rem 1rem 4rem' : '3rem 2rem 6rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 1rem',
            background: theme.colors.accentLight,
            borderRadius: '2px',
            marginBottom: '1.25rem',
          }}>
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: theme.colors.accent,
              fontFamily: theme.typography.fontFamily,
            }}>
              Browse Topics
            </span>
          </div>
          <h1 style={{
            fontFamily: theme.typography.displayFont,
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 700,
            color: theme.colors.text,
            lineHeight: '1.05',
            margin: '0 0 1rem',
            letterSpacing: '-0.03em',
          }}>
            All Categories
          </h1>
          <p style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: isMobile ? '1rem' : '1.125rem',
            color: theme.colors.textMuted,
            margin: 0,
            maxWidth: '480px',
          }}>
            Explore our curated collection of articles organized by topic.
          </p>
        </div>

        {/* Divider with count */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}>
          <div style={{ flex: 1, height: '1px', background: theme.colors.border }} />
          <span style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: '0.75rem',
            color: theme.colors.textMuted,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            {loading ? '…' : `${categories.length} Categories`}
          </span>
          <div style={{ flex: 1, height: '1px', background: theme.colors.border }} />
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '1.5rem' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                height: '220px',
                borderRadius: '12px',
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
            ))}
          </div>
        ) : (
          <>
            {/* Featured large category */}
            {categories.length > 0 && (
              <Link
                to={`/?category=${categories[0].slug}`}
                style={{ textDecoration: 'none', display: 'block', marginBottom: '1.5rem' }}
              >
                <div
                  className="cat-card"
                  style={{
                    padding: isMobile ? '1.5rem' : '3rem',
                    borderRadius: '12px',
                    background: getCategoryColors(theme, 0).bg,
                    border: `1px solid transparent`,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'flex-end',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '1rem' : 0,
                  }}
                >
                  <div>
                    <span className="cat-number" style={{ color: getCategoryColors(theme, 0).accent }}>01</span>
                    <h2 style={{
                      fontFamily: theme.typography.displayFont,
                      fontSize: isMobile ? '1.75rem' : '2.5rem',
                      fontWeight: 700,
                      color: getCategoryColors(theme, 0).text,
                      margin: '0 0 0.75rem',
                    }}>
                      {categories[0].name}
                    </h2>
                    <p style={{
                      fontFamily: theme.typography.fontFamily,
                      fontSize: '1rem',
                      color: getCategoryColors(theme, 0).text,
                      opacity: 0.7,
                      margin: 0,
                      maxWidth: '480px',
                    }}>
                      {categories[0].description}
                    </p>
                  </div>
                  <div className="cat-arrow" style={{
                    width: '52px',
                    height: '52px',
                    background: getCategoryColors(theme, 0).accent,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginLeft: isMobile ? 0 : '2rem',
                  }}>
                    <ArrowUpRight size={22} color={theme.colors.background} />
                  </div>
                </div>
              </Link>
            )}

            {/* Grid for remaining categories */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '1.5rem' }}>
              {categories.slice(1).map((category, index) => {
                const colors = getCategoryColors(theme, index + 1);
                return (
                  <Link
                    key={category.id}
                    to={`/?category=${category.slug}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div
                      className="cat-card"
                      style={{
                        padding: '2rem',
                        borderRadius: '12px',
                        background: colors.bg,
                        border: `1px solid transparent`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '200px',
                        position: 'relative',
                      }}
                    >
                      <div>
                        <span className="cat-number" style={{ color: colors.accent }}>
                          {String(index + 2).padStart(2, '0')}
                        </span>
                        <h3 style={{
                          fontFamily: theme.typography.displayFont,
                          fontSize: isMobile ? '1.125rem' : '1.375rem',
                          fontWeight: 700,
                          color: colors.text,
                          margin: '0 0 0.5rem',
                        }}>
                          {category.name}
                        </h3>
                        <p style={{
                          fontFamily: theme.typography.fontFamily,
                          fontSize: '0.875rem',
                          color: colors.text,
                          opacity: 0.7,
                          margin: 0,
                          lineHeight: '1.6',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {category.description}
                        </p>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '1.5rem',
                      }}>
                        <span className="cat-arrow" style={{
                          width: '36px',
                          height: '36px',
                          background: colors.accent,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <ArrowUpRight size={16} color={theme.colors.background} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};