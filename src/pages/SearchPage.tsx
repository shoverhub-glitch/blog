import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { blogService } from '../services/blogService';
import { Blog } from '../lib/supabase';
import { BlogCard } from '../components/BlogCard';
import { BlogCardSkeleton } from '../components/Skeleton';
import { SEO } from '../components/SEO';
import { useMediaQuery } from '../hooks/useMediaQuery';

const RESULTS_PER_PAGE = 9;

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const pageFromQuery = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const latestSearchRequest = useRef(0);

  const totalPages = Math.max(1, Math.ceil(total / RESULTS_PER_PAGE));

  useEffect(() => {
    const requestId = ++latestSearchRequest.current;

    if (!query) {
      setBlogs([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);

    const debounceTimer = window.setTimeout(() => {
      void searchBlogs(query, pageFromQuery, requestId);
    }, 250);

    return () => {
      window.clearTimeout(debounceTimer);
    };
  }, [query, pageFromQuery]);

  const searchBlogs = async (searchQuery: string, page: number, requestId: number) => {
    try {
      const { blogs: results, total: totalResults } = await blogService.searchBlogs(searchQuery, page, RESULTS_PER_PAGE);

      if (requestId !== latestSearchRequest.current) return;

      setBlogs(results);
      setTotal(totalResults);
    } catch (error) {
      if (requestId !== latestSearchRequest.current) return;

      console.error('Search failed:', error);
      setBlogs([]);
      setTotal(0);
    } finally {
      if (requestId === latestSearchRequest.current) {
        setLoading(false);
      }
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const nextParams = new URLSearchParams(searchParams);
    if (page === 1) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(page));
    }
    setSearchParams(nextParams);
  };

  return (
    <>
      <SEO
        title={query ? `Search: ${query}` : 'Search'}
        description={query ? `Search results for "${query}" on ShoverHub. Find articles, tutorials, and insights.` : 'Search ShoverHub for articles, tutorials, and insights. Ideas Worth Sharing.'}
        url={query ? `/search?q=${encodeURIComponent(query)}${pageFromQuery > 1 ? `&page=${pageFromQuery}` : ''}` : '/search'}
      />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '2rem 1rem 4rem' : '3rem 2rem 6rem', fontFamily: theme.typography.fontFamily }}>
        {/* Header */}
        <div style={{
          paddingBottom: '2.5rem',
          borderBottom: `1px solid ${theme.colors.border}`,
          marginBottom: '3rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: theme.colors.accentLight,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Search size={24} color={theme.colors.accent} />
            </div>
            <div>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: theme.colors.textMuted,
                margin: '0 0 0.5rem',
              }}>
                Search Results
              </p>
              <h1 style={{
                fontFamily: theme.typography.displayFont,
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 700,
                color: theme.colors.text,
                lineHeight: '1.1',
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                "{query}"
              </h1>
              <p style={{ color: theme.colors.textMuted, fontSize: '0.9375rem', margin: '0.75rem 0 0' }}>
                {loading
                  ? 'Searching through articles…'
                  : total === 0
                    ? 'No results found'
                    : `${total} article${total !== 1 ? 's' : ''} found`
                }
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '2rem' }}>
            {[...Array(6)].map((_, i) => <BlogCardSkeleton key={i} />)}
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '2rem' }}>
              {blogs.map((blog) => <BlogCard key={blog.id} blog={blog} variant="featured" />)}
            </div>

            {totalPages > 1 && (
              <div style={{
                marginTop: isMobile ? '2rem' : '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={() => handlePageChange(pageFromQuery - 1)}
                  disabled={pageFromQuery === 1}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem 0.9rem',
                    borderRadius: '6px',
                    border: `1px solid ${theme.colors.border}`,
                    background: 'transparent',
                    color: theme.colors.text,
                    fontSize: '0.875rem',
                    cursor: pageFromQuery === 1 ? 'not-allowed' : 'pointer',
                    opacity: pageFromQuery === 1 ? 0.5 : 1,
                  }}
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <span style={{ color: theme.colors.textMuted, fontSize: '0.875rem' }}>
                  Page {pageFromQuery} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(pageFromQuery + 1)}
                  disabled={pageFromQuery === totalPages}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem 0.9rem',
                    borderRadius: '6px',
                    border: `1px solid ${theme.colors.border}`,
                    background: 'transparent',
                    color: theme.colors.text,
                    fontSize: '0.875rem',
                    cursor: pageFromQuery === totalPages ? 'not-allowed' : 'pointer',
                    opacity: pageFromQuery === totalPages ? 0.5 : 1,
                  }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: isMobile ? '4rem 1.5rem' : '6rem 2rem',
            background: theme.colors.surface,
            borderRadius: '12px',
            border: `1px solid ${theme.colors.border}`,
          }}>
            <div style={{
              width: isMobile ? '64px' : '80px',
              height: isMobile ? '64px' : '80px',
              background: theme.colors.borderLight,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <X size={isMobile ? 28 : 32} color={theme.colors.textMuted} />
            </div>
            <h2 style={{
              fontFamily: theme.typography.displayFont,
              fontSize: isMobile ? '1.375rem' : '1.75rem',
              fontWeight: 700,
              color: theme.colors.text,
              margin: '0 0 0.75rem',
            }}>
              Nothing found
            </h2>
            <p style={{ color: theme.colors.textMuted, fontSize: '1rem', margin: '0 0 0.5rem' }}>
              No articles match <strong style={{ color: theme.colors.text }}>"{query}"</strong>
            </p>
            <p style={{ color: theme.colors.textMuted, fontSize: '0.9375rem' }}>
              Try different keywords or browse our categories.
            </p>
          </div>
        )}
      </div>
    </>
  );
};