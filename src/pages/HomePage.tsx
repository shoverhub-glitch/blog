import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { blogService } from '../services/blogService';
import { Blog, Category, Tag } from '../lib/supabase';
import { BlogCard } from '../components/BlogCard';
import { BlogCardSkeleton } from '../components/Skeleton';
import { SEO } from '../components/SEO';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { baseColors, withAlpha } from '../theme/theme';
import { ChevronLeft, ChevronRight, ArrowRight, TrendingUp, Flame } from 'lucide-react';

export const HomePage = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  useEffect(() => { loadInitialData(); }, []);
  useEffect(() => { loadBlogs(); }, [currentPage, selectedCategory]);
  useEffect(() => {
    if (loading) return;

    let isCancelled = false;
    const timeoutId = window.setTimeout(async () => {
      try {
        const [trending, tags] = await Promise.all([
          blogService.getTrendingBlogs(5),
          blogService.getPopularTags(10),
        ]);

        if (!isCancelled) {
          setTrendingBlogs(trending);
          setPopularTags(tags);
        }
      } catch (error) {
        console.error('Failed to load deferred home data:', error);
      }
    }, 0);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [loading]);

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
      <SEO
        title="Ideas Worth Sharing"
        description="Insights, tutorials, and stories from the ShoverHub team. Building apps, websites, and digital tools - Ideas Worth Sharing."
        url="/"
      />

      <main style={{ fontFamily: 'var(--font-body)' }}>
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
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--color-surface), var(--color-border-light))' }} />
                    )}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(to top, ${withAlpha(baseColors.black, 0.88)} 0%, ${withAlpha(baseColors.black, 0.3)} 60%, transparent 100%)`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: isMobile ? '1.5rem' : '2.5rem'
                    }}>
                      {heroPost.category && <span className="cat-pill">{heroPost.category.name}</span>}
                      <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: isMobile ? '1.35rem' : 'clamp(1.75rem, 3vw, 2.5rem)',
                        fontWeight: 700,
                        color: baseColors.white,
                        lineHeight: '1.2',
                        margin: '0 0 0.75rem',
                      }}>
                        {heroPost.title}
                      </h2>
                      <p style={{
                        color: withAlpha(baseColors.white, 0.75),
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem', color: withAlpha(baseColors.white, 0.6), flexWrap: 'wrap' }}>
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
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        transition: 'all 0.25s',
                      }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'color-mix(in srgb, var(--color-accent) 25%, transparent)';
                          (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
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
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                              {blog.category.name}
                            </span>
                          )}
                          <h4 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: 'var(--color-text)',
                            lineHeight: '1.35',
                            margin: '0.2rem 0 0.25rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}>
                            {blog.title}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
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
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      flex: 1,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <TrendingUp size={14} color="var(--color-accent)" />
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                          Trending
                        </span>
                      </div>
                      {[secondaryPosts[2]].map((blog) => (
                        <Link key={blog.id} to={`/blog/${blog.slug}`} className="trending-item">
                          <span style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.5rem',
                            fontWeight: 900,
                            color: 'var(--color-border-light)',
                            lineHeight: '1',
                            flexShrink: 0,
                            minWidth: '1.5rem',
                          }}>
                            01
                          </span>
                          <div>
                            {blog.category && (
                              <span className="t-cat" style={{ fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                                {blog.category.name}
                              </span>
                            )}
                            <h5 className="t-title" style={{
                              fontSize: '0.8125rem',
                              fontWeight: 700,
                              color: 'var(--color-text)',
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
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}>
                      {blog.cover_image && (
                        <div style={{ width: '80px', height: '60px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={blog.cover_image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" fetchPriority="low" />
                        </div>
                      )}
                      <div>
                        {blog.category && (
                          <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                            {blog.category.name}
                          </span>
                        )}
                        <h4 style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          color: 'var(--color-text)',
                          lineHeight: '1.35',
                          margin: '0.2rem 0 0.25rem',
                        }}>
                          {blog.title}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
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

        {/* Trending Posts Section */}
        {trendingBlogs.length > 0 && (
          <section style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: isMobile ? '2rem' : '4rem',
          }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: `0 ${isMobile ? '1rem' : '2rem'} ${isMobile ? '2rem' : '4rem'}` }}>
              <div className="section-rule">
                <Flame size={18} color="var(--color-accent)" />
                <span className="section-label">Trending Now</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)', gap: isMobile ? '1rem' : '1.5rem' }}>
                {trendingBlogs.map((blog, index) => (
                  <Link key={blog.id} to={`/blog/${blog.slug}`} style={{ textDecoration: 'none' }}>
                    <article style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      padding: isMobile ? '1rem' : '1.25rem',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      transition: 'all 0.25s',
                      height: '100%',
                    }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'color-mix(in srgb, var(--color-accent) 25%, transparent)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: 'var(--color-border-light)',
                        lineHeight: 1,
                      }}>
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      {blog.cover_image && (
                        <div style={{ borderRadius: '4px', overflow: 'hidden', aspectRatio: '16/9' }}>
                          <img src={blog.cover_image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        </div>
                      )}
                      <div>
                        {blog.category && (
                          <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                            {blog.category.name}
                          </span>
                        )}
                        <h4 style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: isMobile ? '0.8125rem' : '0.875rem',
                          fontWeight: 700,
                          color: 'var(--color-text)',
                          lineHeight: 1.35,
                          margin: '0.25rem 0 0.5rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {blog.title}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {blog.view_count.toLocaleString()} views
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <section style={{
            borderTop: '1px solid var(--color-border)',
            padding: isMobile ? '1.5rem 1rem' : '2rem',
            background: 'var(--color-surface)',
          }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                }}>
                  Popular Tags:
                </span>
                {popularTags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/search?q=${tag.name}`}
                    style={{
                      padding: '0.375rem 0.875rem',
                      background: 'var(--color-background)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '100px',
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Latest articles section */}
        <section style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: isMobile ? '2rem' : '4rem',
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: `0 ${isMobile ? '1rem' : '2rem'} ${isMobile ? '3rem' : '5rem'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: isMobile ? '1.25rem' : 'clamp(1.5rem, 2.5vw, 2rem)',
                fontWeight: 700,
                color: 'var(--color-text)',
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
                  background: selectedCategory === null ? 'var(--color-text)' : 'transparent',
                  color: selectedCategory === null ? 'var(--color-background)' : 'var(--color-text)',
                  borderColor: selectedCategory === null ? 'var(--color-text)' : 'var(--color-border)',
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
                    background: selectedCategory === cat.slug ? 'var(--color-text)' : 'transparent',
                    color: selectedCategory === cat.slug ? 'var(--color-background)' : 'var(--color-text)',
                    borderColor: selectedCategory === cat.slug ? 'var(--color-text)' : 'var(--color-border)',
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
                    borderTop: '1px solid var(--color-border)',
                    flexWrap: 'wrap',
                  }}>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="page-btn"
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
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
              <div style={{ textAlign: 'center', padding: isMobile ? '3rem 1rem' : '5rem 0', color: 'var(--color-text-muted)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                  No articles found
                </p>
                <p style={{ fontFamily: 'var(--font-body)' }}>Try a different category</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};



