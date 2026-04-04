import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, Share2, Clock, User, ChevronRight } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useTheme } from '../theme/ThemeContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { blogService } from '../services/blogService';
import { Blog } from '../lib/supabase';
import { BlogCard } from '../components/BlogCard';
import { BlogDetailSkeleton } from '../components/Skeleton';
import { SEO } from '../components/SEO';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { createArticleSchema } from '../utils/seoSchemas';

export const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (slug) loadBlog(slug);
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const loadBlog = async (slug: string) => {
    setLoading(true);
    try {
      const blogData = await blogService.getBlogBySlug(slug);
      if (blogData) {
        setBlog(blogData);
        await blogService.incrementViewCount(blogData.id);
        const related = await blogService.getRelatedBlogs(blogData.id, blogData.category_id, 3);
        setRelatedBlogs(related);
      }
    } catch (error) {
      console.error('Failed to load blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({ title: blog.title, text: blog.excerpt, url: window.location.href });
      } catch { }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const estimateReadTime = (content: string) => {
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  };

  if (loading) return <BlogDetailSkeleton />;

  if (!blog) {
    return (
      <div style={{ maxWidth: '700px', margin: '8rem auto', textAlign: 'center', fontFamily: theme.typography.fontFamily }}>
        <p style={{ color: theme.colors.textMuted, fontSize: '1.125rem' }}>Article not found.</p>
        <Link to="/" style={{ color: theme.colors.accent, display: 'inline-block', marginTop: '1rem' }}>← Back to Home</Link>
      </div>
    );
  }

  const readTime = estimateReadTime(blog.content);

  return (
    <>
      <style>{`
        .article-body { font-family: ${theme.typography.fontFamily}; font-size: 1.125rem; line-height: 1.85; color: ${theme.colors.textSecondary}; }
        .article-body h1, .article-body h2, .article-body h3, .article-body h4 {
          font-family: ${theme.typography.displayFont};
          color: ${theme.colors.text};
          margin: 2.5rem 0 1rem;
          line-height: 1.2;
        }
        .article-body h2 { font-size: 1.75rem; }
        .article-body h3 { font-size: 1.375rem; }
        .article-body p { margin: 0 0 1.75rem; }
        .article-body a { color: ${theme.colors.accent}; text-decoration: underline; text-underline-offset: 3px; }
        .article-body blockquote {
          border-left: 3px solid ${theme.colors.accent};
          margin: 2rem 0;
          padding: 1.25rem 1.75rem;
          background: ${theme.colors.surface};
          border-radius: 0 8px 8px 0;
          font-family: ${theme.typography.displayFont};
          font-size: 1.25rem;
          font-style: italic;
          color: ${theme.colors.text};
        }
        .article-body ul, .article-body ol { margin: 0 0 1.75rem 1.5rem; }
        .article-body li { margin-bottom: 0.5rem; }
        .article-body img { width: 100%; border-radius: 8px; margin: 2rem 0; }
        .article-body code {
          background: ${theme.colors.surface};
          border: 1px solid ${theme.colors.border};
          border-radius: 3px;
          padding: 0.15em 0.4em;
          font-size: 0.875em;
        }
        .article-body pre {
          background: ${theme.colors.surface};
          border: 1px solid ${theme.colors.border};
          border-radius: 8px;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 2rem 0;
        }
        .article-body pre code { background: none; border: none; padding: 0; }
        .share-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; border-radius: 4px; border: 1px solid ${theme.colors.border}; background: transparent; color: ${theme.colors.text}; cursor: pointer; font-size: 0.8125rem; font-weight: 500; font-family: ${theme.typography.fontFamily}; transition: all 0.2s; }
        .share-btn:hover { background: ${theme.colors.surface}; border-color: ${theme.colors.text}; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: ${theme.colors.textMuted}; text-decoration: none; font-size: 0.8125rem; font-weight: 500; letter-spacing: 0.05em; transition: color 0.2s; font-family: ${theme.typography.fontFamily}; }
        .back-link:hover { color: ${theme.colors.accent}; }
        .tag-pill { display: inline-block; padding: 0.3rem 0.875rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: 100px; font-size: 0.8125rem; color: ${theme.colors.textMuted}; font-family: ${theme.typography.fontFamily}; transition: all 0.2s; }
        .tag-pill:hover { border-color: ${theme.colors.text}; color: ${theme.colors.text}; }
      `}</style>

      <SEO
        title={blog.title}
        description={blog.excerpt}
        image={blog.cover_image}
        type="article"
        publishedTime={blog.published_at}
        author={blog.author_name}
        url={window.location.href}
        category={blog.category?.name}
        tags={blog.tags?.map(t => t.name)}
        jsonLd={createArticleSchema(blog)}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '1rem',
      }}>
        <ol style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontSize: '0.875rem',
        }}>
          <li><Link to="/" style={{ color: theme.colors.textMuted }}>Home</Link></li>
          <li style={{ color: theme.colors.textMuted }}><ChevronRight size={14} /></li>
          {blog.category && (
            <>
              <li><Link to={`/?category=${blog.category.slug}`} style={{ color: theme.colors.textMuted }}>{blog.category.name}</Link></li>
              <li style={{ color: theme.colors.textMuted }}><ChevronRight size={14} /></li>
            </>
          )}
          <li style={{ color: theme.colors.text }}>{blog.title}</li>
        </ol>
      </nav>

      {/* Hero with cover image */}
      <div style={{ position: 'relative', background: theme.colors.text }}>
        {blog.cover_image && (
          <>
            <img
              src={blog.cover_image}
              alt={blog.title}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              style={{
                width: '100%',
                height: isMobile ? '250px' : 'clamp(300px, 45vh, 500px)',
                objectFit: 'cover',
                display: 'block',
                opacity: 0.4,
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 100%)' }} />
          </>
        )}
        <div style={{
          position: blog.cover_image ? 'absolute' : 'relative',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: '820px',
          margin: '0 auto',
          padding: blog.cover_image ? `0 ${isMobile ? '1rem' : '2rem'} ${isMobile ? '2rem' : '3.5rem'}` : `${isMobile ? '2rem' : '4rem'} ${isMobile ? '1rem' : '2rem'} ${isMobile ? '2rem' : '3rem'}`,
        }}>
          <Link to="/" className="back-link" style={{ color: blog.cover_image ? 'rgba(255,255,255,0.7)' : theme.colors.textMuted, marginBottom: isMobile ? '1rem' : '1.5rem', display: 'inline-flex' }}>
            <ArrowLeft size={14} /> Back
          </Link>
          {blog.category && (
            <div style={{ marginBottom: isMobile ? '0.75rem' : '1rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                background: theme.colors.accent,
                color: '#fff',
                fontSize: '0.625rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: '2px',
                fontFamily: theme.typography.fontFamily,
              }}>
                {blog.category.name}
              </span>
            </div>
          )}
          <h1 style={{
            fontFamily: theme.typography.displayFont,
            fontSize: isMobile ? '1.5rem' : 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 700,
            color: blog.cover_image ? '#FFFFFF' : theme.colors.text,
            lineHeight: '1.15',
            margin: `0 0 ${isMobile ? '1rem' : '1.5rem'}`,
            letterSpacing: '-0.02em',
          }}>
            {blog.title}
          </h1>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: isMobile ? '0.75rem' : '1.5rem',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            color: blog.cover_image ? 'rgba(255,255,255,0.65)' : theme.colors.textMuted,
            fontFamily: theme.typography.fontFamily,
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <User size={12} />
              {blog.author_name}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={12} />
              {new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={12} />
              {readTime} min
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Eye size={12} />
              {blog.view_count?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: isMobile ? '1.5rem 1rem' : '3rem 2rem' }}>
        <AdPlaceholder slot="article-top" format="horizontal" />

        {/* Excerpt pull quote */}
        <p style={{
          fontFamily: theme.typography.displayFont,
          fontSize: isMobile ? '1rem' : '1.25rem',
          fontStyle: 'italic',
          color: theme.colors.textSecondary,
          lineHeight: 1.6,
          borderLeft: `3px solid ${theme.colors.accent}`,
          paddingLeft: isMobile ? '1rem' : '1.5rem',
          margin: `0 0 ${isMobile ? '2rem' : '3rem'}`,
        }}>
          {blog.excerpt}
        </p>

        <AdPlaceholder slot="article-mid-1" format="rectangle" />

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
        />

        <AdPlaceholder slot="article-mid-2" format="rectangle" />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', marginTop: '1rem' }}>
            {blog.tags.map((tag) => (
              <span key={tag.id} className="tag-pill">#{tag.name}</span>
            ))}
          </div>
        )}

        {/* Share bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem 0',
          borderTop: `1px solid ${theme.colors.border}`,
          borderBottom: `1px solid ${theme.colors.border}`,
          marginBottom: '4rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <span style={{ fontFamily: theme.typography.fontFamily, fontSize: '0.875rem', color: theme.colors.textMuted }}>
            Found this helpful? Share it.
          </span>
          <button onClick={handleShare} className="share-btn">
            <Share2 size={14} />
            {shared ? 'Link Copied!' : 'Share Article'}
          </button>
        </div>

        <AdPlaceholder slot="article-bottom" format="horizontal" />
      </div>

      {/* Related articles */}
      {relatedBlogs.length > 0 && (
        <section style={{
          borderTop: `1px solid ${theme.colors.border}`,
          background: theme.colors.surface,
          padding: isMobile ? '2rem 1rem' : '4rem 2rem',
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: isMobile ? '1.5rem' : '2.5rem',
            }}>
              <h2 style={{
                fontFamily: theme.typography.displayFont,
                fontSize: isMobile ? '1.25rem' : '1.75rem',
                fontWeight: 700,
                color: theme.colors.text,
                margin: 0,
              }}>
                Related Articles
              </h2>
              <div style={{ flex: 1, height: '1px', background: theme.colors.border }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: isMobile ? '1rem' : '2rem' }}>
              {relatedBlogs.map((b) => <BlogCard key={b.id} blog={b} variant="featured" />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
};