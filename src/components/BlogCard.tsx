import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Blog } from '../lib/supabase';
import { baseColors, withAlpha } from '../theme/theme';
import { prefetchRoute } from '../utils/prefetch';

interface BlogCardProps {
  blog: Blog;
  variant?: 'default' | 'featured' | 'horizontal' | 'minimal';
}

export const BlogCard = memo(({ blog, variant = 'default' }: BlogCardProps) => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const imageHeight = isMobile ? '180px' : '200px';
  const padding = isMobile ? '1.25rem' : '1.5rem';
  const titleSize = isMobile ? '1rem' : '1.1875rem';

  if (variant === 'featured') {
    return (
      <Link to={`/blog/${blog.slug}`} onMouseEnter={() => prefetchRoute('blog-detail')} onFocus={() => prefetchRoute('blog-detail')} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <article className="blog-card-featured" style={{
          background: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '8px',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {blog.cover_image && (
            <div style={{ position: 'relative', height: imageHeight, overflow: 'hidden', flexShrink: 0 }}>
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="blog-card-featured-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
              <div className="blog-card-featured-overlay" style={{
                position: 'absolute',
                inset: 0,
                background: withAlpha(baseColors.black, 0.3),
              }} />
            </div>
          )}
          <div style={{ padding: padding, display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            {blog.category && (
              <span style={{
                display: 'inline-block',
                fontSize: isMobile ? '0.6875rem' : '0.625rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: theme.colors.accent,
                fontFamily: theme.typography.fontFamily,
              }}>
                {blog.category.name}
              </span>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
              <h3 style={{
                fontFamily: theme.typography.displayFont,
                fontSize: titleSize,
                fontWeight: 700,
                color: theme.colors.text,
                lineHeight: '1.3',
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                flex: 1,
              }}>
                {blog.title}
              </h3>
              <span className="blog-card-featured-arrow" style={{
                flexShrink: 0,
                width: isMobile ? '24px' : '28px',
                height: isMobile ? '24px' : '28px',
                background: theme.colors.accent,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.background,
              }}>
                <ArrowUpRight size={12} />
              </span>
            </div>
            <p style={{
              fontFamily: theme.typography.fontFamily,
              fontSize: isMobile ? '0.8125rem' : '0.9375rem',
              color: theme.colors.textMuted,
              lineHeight: 1.6,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}>
              {blog.excerpt}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              paddingTop: '0.75rem',
              borderTop: `1px solid ${theme.colors.borderLight}`,
              fontSize: '0.75rem',
              color: theme.colors.textMuted,
              fontFamily: theme.typography.fontFamily,
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={12} />
                {formatDate(blog.published_at)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Eye size={12} />
                {blog.view_count?.toLocaleString()}
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link to={`/blog/${blog.slug}`} onMouseEnter={() => prefetchRoute('blog-detail')} onFocus={() => prefetchRoute('blog-detail')} style={{ textDecoration: 'none', display: 'block' }}>
        <article className="blog-card-horizontal" style={{
          display: 'flex',
          gap: isMobile ? '0.75rem' : '1.25rem',
          padding: isMobile ? '0.75rem' : '1rem',
          borderRadius: '6px',
          border: '1px solid transparent',
          ['--blog-card-surface-hover' as string]: theme.colors.surfaceHover,
        } as React.CSSProperties}>
          {blog.cover_image && (
            <div style={{ width: isMobile ? '80px' : '100px', height: isMobile ? '60px' : '80px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="blog-card-horizontal-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            {blog.category && (
              <span style={{
                fontSize: '0.625rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: theme.colors.accent,
                fontFamily: theme.typography.fontFamily,
              }}>
                {blog.category.name}
              </span>
            )}
            <h4 style={{
              fontFamily: theme.typography.displayFont,
              fontSize: isMobile ? '0.875rem' : '1rem',
              fontWeight: 700,
              color: theme.colors.text,
              lineHeight: 1.35,
              margin: '0.2rem 0 0.25rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {blog.title}
            </h4>
            <span style={{ fontSize: '0.6875rem', color: theme.colors.textMuted, fontFamily: theme.typography.fontFamily }}>
              {formatDate(blog.published_at)}
            </span>
          </div>
        </article>
      </Link>
    );
  }

  // Default card
  return (
    <Link to={`/blog/${blog.slug}`} onMouseEnter={() => prefetchRoute('blog-detail')} onFocus={() => prefetchRoute('blog-detail')} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <article className="blog-card-default" style={{
        background: theme.colors.surface,
        borderRadius: '8px',
        overflow: 'hidden',
        border: `1px solid ${theme.colors.border}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ['--blog-card-shadow' as string]: theme.shadows.lg,
        ['--blog-card-accent' as string]: theme.colors.accent,
        ['--blog-card-accent-soft' as string]: `${theme.colors.accent}20`,
      } as React.CSSProperties}>
        {blog.cover_image ? (
          <div style={{ height: imageHeight, overflow: 'hidden', flexShrink: 0 }}>
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="blog-card-default-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          </div>
        ) : (
          <div style={{
            height: imageHeight,
            flexShrink: 0,
            background: `linear-gradient(135deg, ${theme.colors.borderLight} 0%, ${theme.colors.surface} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontFamily: theme.typography.displayFont, fontSize: '2.5rem', opacity: 0.1 }}>S</span>
          </div>
        )}
        <div style={{ padding: padding, display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {blog.category && (
            <span style={{
              display: 'inline-block',
              fontSize: '0.625rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: theme.colors.accent,
              fontFamily: theme.typography.fontFamily,
            }}>
              {blog.category.name}
            </span>
          )}
          <h3 className="blog-card-default-title" style={{
            fontFamily: theme.typography.displayFont,
            fontSize: titleSize,
            fontWeight: 700,
            color: theme.colors.text,
            lineHeight: 1.35,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}>
            {blog.title}
          </h3>
          <p style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: isMobile ? '0.8125rem' : '0.875rem',
            color: theme.colors.textMuted,
            lineHeight: 1.6,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}>
            {blog.excerpt}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            paddingTop: '0.5rem',
            borderTop: `1px solid ${theme.colors.borderLight}`,
            fontSize: '0.6875rem',
            color: theme.colors.textMuted,
            fontFamily: theme.typography.fontFamily,
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={11} />
              {formatDate(blog.published_at)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Eye size={11} />
              {blog.view_count?.toLocaleString()}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
});
