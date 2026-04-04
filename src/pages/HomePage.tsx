import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { blogService } from '../services/blogService';
import { Blog, Category } from '../lib/supabase';
import { BlogCard } from '../components/BlogCard';
import { BlogCardSkeleton } from '../components/Skeleton';
import { SEO } from '../components/SEO';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { ChevronLeft, ChevronRight, ArrowRight, TrendingUp } from 'lucide-react';

export const HomePage = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  useEffect(() => { loadInitialData(); }, []);
  useEffect(() => { loadBlogs(); }, [currentPage, selectedCategory]);

  const loadInitialData = async () => {
    try {
      const [featured, cats] = await Promise.all([
        blogService.getFeaturedBlogs(4),
        blogService.getAllCategories(),
      ]);
      setFeaturedBlogs(featured);
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const { blogs, total } = selectedCategory
        ? await blogService.getBlogsByCategory(selectedCategory, currentPage, 9)
        : await blogService.getLatestBlogs(currentPage, 9);
      setLatestBlogs(blogs);
      setTotalPages(Math.ceil(total / 9));
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
  };

  const heroPost = featuredBlogs[0];
  const secondaryPosts = featuredBlogs.slice(1, 4);
  const sectionPadding = isMobile ? '1.5rem 1rem' : isTablet ? '2rem 1.5rem' : '2.5rem 2rem';
  const heroHeight = isMobile ? '400px' : isTablet ? '480px' : '560px';

  if (loading) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: sectionPadding }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[...Array(6)].map((_, i) => <BlogCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .hero-link { text-decoration: none; display: block; }
        .hero-card { position: relative; overflow: hidden; border-radius: 12px; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .hero-card:hover { transform: scale(1.01); }
        .hero-card:hover .hero-img { transform: scale(1.04); }
        .hero-img { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); width: 100%; height: 100%; object-fit: cover; display: block; }
        .cat-pill { display: inline-block; padding: 0.3rem 0.875rem; background: ${theme.colors.accent}; color: #fff; font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 2px; font-family: ${theme.typography.fontFamily}; margin-bottom: 0.875rem; }
        .section-rule { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .section-rule::after { content: ''; flex: 1; height: 1px; background: ${theme.colors.border}; }
        .section-label { font-family: ${theme.typography.fontFamily}; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: ${theme.colors.textMuted}; white-space: nowrap; }
        .filter-btn { font-family: ${theme.typography.fontFamily}; font-size: 0.8125rem; font-weight: 500; padding: 0.5rem 1rem; border-radius: 100px; cursor: pointer; transition: all 0.2s; border: 1px solid ${theme.colors.border}; white-space: nowrap; }
        .filter-btn:hover { border-color: ${theme.colors.text}; }
        .page-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; border-radius: 4px; border: 1px solid ${theme.colors.border}; background: transparent; color: ${theme.colors.text}; cursor: pointer; font-size: 0.875rem; font-weight: 500; font-family: ${theme.typography.fontFamily}; transition: all 0.2s; }
        .page-btn:hover:not(:disabled) { background: ${theme.colors.surface}; border-color: ${theme.colors.text}; }
        .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .trending-item { display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid ${theme.colors.borderLight}; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .trending-item:last-child { border-bottom: none; }
        .trending-item:hover .t-title { color: ${theme.colors.accent}; }
        .t-title { transition: color 0.2s; font-family: ${theme.typography.displayFont}; }
        .view-all-btn { display: inline-flex; align-items: center; gap: 0.5rem; font-family: ${theme.typography.fontFamily}; font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: ${theme.colors.accent}; text-decoration: none; padding-bottom: 2px; border-bottom: 1px solid ${theme.colors.accent}; transition: all 0.2s; }
        .view-all-btn:hover { gap: 0.75rem; }
      `}</style>

      <SEO
        title="Ideas Worth Sharing"
        description="Insights, tutorials, and stories from the ShoverHub team. Building apps, websites, and digital tools - Ideas Worth Sharing."
        url="/"
      />

      <main style={{ fontFamily: theme.typography.fontFamily }}>
        <AdPlaceholder slot="top-banner" format="horizontal" />

        {/* Hero Section */}
        {featuredBlogs.length > 0 && (
          <section style={{ maxWidth: '1400px', margin: '0 auto', padding: sectionPadding }}>
            <div className="section-rule">
              <span className="section-label">Featured Stories</span>
            </div>

            {/* Hero Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isTablet ? '1fr' : 'minmax(0, 1fr) minmax(280px, 340px)', 
              gap: isMobile ? '1rem' : '1.5rem',
              marginBottom: isMobile ? '3rem' : '5rem' 
            }}>
              {/* Hero post */}
              {heroPost && (
                <Link to={`/blog/${heroPost.slug}`} className="hero-link">
                  <div className="hero-card" style={{ height: heroHeight }}>
                    {heroPost.cover_image ? (
                      <img src={heroPost.cover_image} alt={heroPost.title} className="hero-img" loading="eager" decoding="async" fetchPriority="high" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.borderLight})` }} />
                    )}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: isMobile ? '1.5rem' : '2.5rem'
                    }}>
                      {heroPost.category && <span className="cat-pill">{heroPost.category.name}</span>}
                      <h2 style={{
                        fontFamily: theme.typography.displayFont,
                        fontSize: isMobile ? '1.35rem' : 'clamp(1.75rem, 3vw, 2.5rem)',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        lineHeight: '1.2',
                        margin: '0 0 0.75rem',
                      }}>
                        {heroPost.title}
                      </h2>
                      <p style={{
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        lineHeight: '1.6',
                        margin: '0 0 0.75rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {heroPost.excerpt}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', flexWrap: 'wrap' }}>
                        <span>{heroPost.author_name}</span>
                        <span>·</span>
                        <span>{new Date(heroPost.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Sidebar: secondary featured + trending */}
              {!isTablet && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Secondary featured posts */}
                  {secondaryPosts.slice(0, 2).map((blog) => (
                    <Link key={blog.id} to={`/blog/${blog.slug}`} style={{ textDecoration: 'none' }}>
                      <article style={{
                        display: 'flex',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: theme.colors.surface,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        transition: 'all 0.25s',
                      }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = theme.colors.accent + '40';
                          (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = theme.colors.border;
                          (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                        }}
                      >
                        {blog.cover_image && (
                          <div style={{ width: '70px', height: '55px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={blog.cover_image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" fetchPriority="low" />
                          </div>
                        )}
                        <div>
                          {blog.category && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.colors.accent }}>
                              {blog.category.name}
                            </span>
                          )}
                          <h4 style={{
                            fontFamily: theme.typography.displayFont,
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: theme.colors.text,
                            lineHeight: '1.35',
                            margin: '0.2rem 0 0.25rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}>
                            {blog.title}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: theme.colors.textMuted }}>
                            {new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </article>
                    </Link>
                  ))}

                  {/* Trending sidebar */}
                  {secondaryPosts.length > 2 && (
                    <div style={{
                      padding: '1rem',
                      background: theme.colors.surface,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '8px',
                      flex: 1,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <TrendingUp size={14} color={theme.colors.accent} />
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.colors.textMuted }}>
                          Trending
                        </span>
                      </div>
                      {[secondaryPosts[2]].map((blog) => (
                        <Link key={blog.id} to={`/blog/${blog.slug}`} className="trending-item">
                          <span style={{
                            fontFamily: theme.typography.displayFont,
                            fontSize: '1.5rem',
                            fontWeight: 900,
                            color: theme.colors.borderLight,
                            lineHeight: '1',
                            flexShrink: 0,
                            minWidth: '1.5rem',
                          }}>
                            01
                          </span>
                          <div>
                            {blog.category && (
                              <span style={{ fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.colors.accent }}>
                                {blog.category.name}
                              </span>
                            )}
                            <h5 className="t-title" style={{
                              fontSize: '0.8125rem',
                              fontWeight: 700,
                              color: theme.colors.text,
                              lineHeight: '1.35',
                              margin: '0.15rem 0 0',
                            }}>
                              {blog.title}
                            </h5>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Secondary posts on tablet */}
            {isTablet && secondaryPosts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {secondaryPosts.map((blog) => (
                  <Link key={blog.id} to={`/blog/${blog.slug}`} style={{ textDecoration: 'none' }}>
                    <article style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '1rem',
                      background: theme.colors.surface,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '8px',
                    }}>
                      {blog.cover_image && (
                        <div style={{ width: '80px', height: '60px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={blog.cover_image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" fetchPriority="low" />
                        </div>
                      )}
                      <div>
                        {blog.category && (
                          <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.colors.accent }}>
                            {blog.category.name}
                          </span>
                        )}
                        <h4 style={{
                          fontFamily: theme.typography.displayFont,
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          color: theme.colors.text,
                          lineHeight: '1.35',
                          margin: '0.2rem 0 0.25rem',
                        }}>
                          {blog.title}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: theme.colors.textMuted }}>
                          {new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Latest articles section */}
        <section style={{
          borderTop: `1px solid ${theme.colors.border}`,
          paddingTop: isMobile ? '2rem' : '4rem',
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: `0 ${isMobile ? '1rem' : '2rem'} ${isMobile ? '3rem' : '5rem'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h2 style={{
                fontFamily: theme.typography.displayFont,
                fontSize: isMobile ? '1.25rem' : 'clamp(1.5rem, 2.5vw, 2rem)',
                fontWeight: 700,
                color: theme.colors.text,
                margin: 0,
              }}>
                Latest Articles
              </h2>
              <Link to="/categories" className="view-all-btn">
                All Categories <ArrowRight size={14} />
              </Link>
            </div>

            {/* Category filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: isMobile ? '1.5rem' : '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              <button
                onClick={() => handleCategoryChange(null)}
                className="filter-btn"
                style={{
                  background: selectedCategory === null ? theme.colors.text : 'transparent',
                  color: selectedCategory === null ? theme.colors.background : theme.colors.text,
                  borderColor: selectedCategory === null ? theme.colors.text : theme.colors.border,
                }}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className="filter-btn"
                  style={{
                    background: selectedCategory === cat.slug ? theme.colors.text : 'transparent',
                    color: selectedCategory === cat.slug ? theme.colors.background : theme.colors.text,
                    borderColor: selectedCategory === cat.slug ? theme.colors.text : theme.colors.border,
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {loadingBlogs ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {[...Array(6)].map((_, i) => <BlogCardSkeleton key={i} />)}
              </div>
            ) : latestBlogs.length > 0 ? (
              <>
                {/* Blog grid */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: isMobile ? '1rem' : '2rem' }}>
                  {latestBlogs.slice(0, isMobile ? 3 : 6).map((blog) => (
                    <BlogCard key={blog.id} blog={blog} variant="featured" />
                  ))}
                </div>

                {latestBlogs.length > (isMobile ? 3 : 6) && (
                  <>
                    <AdPlaceholder slot="in-feed-1" format="horizontal" />
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: isMobile ? '1rem' : '2rem', marginTop: isMobile ? '1rem' : '2rem' }}>
                      {latestBlogs.slice(isMobile ? 3 : 6).map((blog) => (
                        <BlogCard key={blog.id} blog={blog} variant="featured" />
                      ))}
                    </div>
                  </>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: isMobile ? '0.75rem' : '1.5rem',
                    marginTop: isMobile ? '2rem' : '4rem',
                    paddingTop: '1.5rem',
                    borderTop: `1px solid ${theme.colors.border}`,
                    flexWrap: 'wrap',
                  }}>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="page-btn"
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                    <span style={{ fontSize: '0.875rem', color: theme.colors.textMuted, fontFamily: theme.typography.fontFamily }}>
                      {currentPage} <span style={{ margin: '0 0.25rem' }}>of</span> {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="page-btn"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: isMobile ? '3rem 1rem' : '5rem 0', color: theme.colors.textMuted }}>
                <p style={{ fontFamily: theme.typography.displayFont, fontSize: '1.25rem', marginBottom: '0.5rem', color: theme.colors.text }}>
                  No articles found
                </p>
                <p style={{ fontFamily: theme.typography.fontFamily }}>Try a different category</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};
