import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, Share2, Clock, User, ChevronRight, MessageCircle, Send, List } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useTheme } from '../theme/ThemeContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { blogService } from '../services/blogService';
import { Blog, Tag, supabase } from '../lib/supabase';
import { BlogCard } from '../components/BlogCard';
import { BlogDetailSkeleton } from '../components/Skeleton';
import { SEO } from '../components/SEO';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { createArticleSchema } from '../utils/seoSchemas';
import { getTagsArray } from '../utils/helpers';
import { useTableOfContents } from '../components/TableOfContents';
import { withAlpha } from '../theme/theme';

interface Comment {
  id: string;
  blog_id: string;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  created_at: string;
  children?: Comment[];
}

export const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [shared, setShared] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  const { headings, activeHeading, scrollToHeading } = useTableOfContents(blog?.content || '');

  const tags = useMemo(() => getTagsArray(blog?.tags), [blog?.tags]);
  const coverOverlayBase = theme.mode === 'dark' ? theme.colors.background : theme.colors.primary;
  const coverTextColor = theme.mode === 'dark' ? theme.colors.text : theme.colors.background;

  const readTime = useMemo(() => {
    if (!blog?.content) return 1;
    const words = blog.content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  }, [blog?.content]);

  const sanitizedContent = useMemo(() => {
    if (!blog?.content) return '';

    const contentWithHeadingIds = blog.content.replace(
      /<h([2-3])([^>]*)>(.*?)<\/h\1>/gi,
      (_match, level, attrs, inner) => {
        const text = inner
          .replace(/<[^>]+>/g, '')
          .trim()
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');

        const hasId = /\sid=("[^"]*"|'[^']*')/i.test(attrs);
        const normalizedAttrs = text
          ? (hasId
            ? attrs.replace(/\sid=("[^"]*"|'[^']*')/i, ` id="${text}"`)
            : `${attrs} id="${text}"`)
          : attrs;

        return `<h${level}${normalizedAttrs}>${inner}</h${level}>`;
      }
    );

    const imageOptimizedContent = contentWithHeadingIds.replace(/<img\b([^>]*)>/gi, (_match, attrs) => {
      let optimizedAttrs = attrs;
      if (!/\sloading=/i.test(optimizedAttrs)) {
        optimizedAttrs += ' loading="lazy"';
      }
      if (!/\sdecoding=/i.test(optimizedAttrs)) {
        optimizedAttrs += ' decoding="async"';
      }
      if (!/\sfetchpriority=/i.test(optimizedAttrs)) {
        optimizedAttrs += ' fetchpriority="low"';
      }
      return `<img${optimizedAttrs}>`;
    });

    return DOMPurify.sanitize(imageOptimizedContent);
  }, [blog?.content]);

  const loadComments = useCallback(async (blogId: string) => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('blog_id', blogId)
        .eq('approved', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const allComments = (data || []) as Comment[];
      const repliesMap = new Map<string, Comment[]>();
      const roots: Comment[] = [];

      allComments.forEach((comment) => {
        if (comment.parent_id) {
          const parentReplies = repliesMap.get(comment.parent_id) || [];
          parentReplies.push(comment);
          repliesMap.set(comment.parent_id, parentReplies);
          return;
        }
        roots.push(comment);
      });

      roots.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
      setComments(
        roots.map((comment) => ({
          ...comment,
          children: repliesMap.get(comment.id) || [],
        }))
      );
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoadingComments(false);
    }
  }, []);

  const loadBlog = useCallback(async (nextSlug: string) => {
    setLoading(true);
    try {
      const blogData = await blogService.getBlogBySlug(nextSlug);
      if (blogData) {
        setBlog(blogData);

        // Keep first paint fast by not blocking on side effects.
        void blogService.incrementViewCount(blogData.id);

        const [related] = await Promise.all([
          blogService.getRelatedBlogs(blogData.id, blogData.category_id, 3),
          loadComments(blogData.id),
        ]);

        setRelatedBlogs(related);
      }
    } catch (error) {
      console.error('Failed to load blog:', error);
    } finally {
      setLoading(false);
    }
  }, [loadComments]);

  useEffect(() => {
    if (slug) loadBlog(slug);
  }, [slug, loadBlog]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;

    setCommentError('');
    setSubmittingComment(true);

    try {
      const { error } = await supabase.from('comments').insert({
        blog_id: blog.id,
        author_name: commentForm.name.trim(),
        author_email: commentForm.email.trim(),
        content: commentForm.content.trim(),
        approved: true,
      });

      if (error) throw error;

      setCommentSuccess(true);
      setCommentForm({ name: '', email: '', content: '' });
      loadComments(blog.id);
      setTimeout(() => setCommentSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to submit comment:', error);
      setCommentError('Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({ title: blog.title, text: blog.excerpt, url: window.location.href });
        return;
      } catch {
        // Fallback to clipboard if share fails or is cancelled
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
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

  return (
    <>
      <style>{`
        .article-body { font-family: ${theme.typography.fontFamily}; font-size: ${isMobile ? '1rem' : '1.125rem'}; line-height: 1.85; color: ${theme.colors.textSecondary}; }
        .article-body h1, .article-body h2, .article-body h3, .article-body h4 {
          font-family: ${theme.typography.displayFont};
          color: ${theme.colors.text};
          margin: 2.5rem 0 1rem;
          line-height: 1.2;
        }
        .article-body h2 { font-size: ${isMobile ? '1.375rem' : '1.75rem'}; }
        .article-body h3 { font-size: ${isMobile ? '1.125rem' : '1.375rem'}; }
        .article-body p { margin: 0 0 1.75rem; }
        .article-body a { color: ${theme.colors.accent}; text-decoration: underline; text-underline-offset: 3px; }
        .article-body blockquote {
          border-left: 3px solid ${theme.colors.accent};
          margin: 2rem 0;
          padding: 1.25rem 1.5rem;
          background: ${theme.colors.surface};
          border-radius: 0 8px 8px 0;
          font-family: ${theme.typography.displayFont};
          font-size: ${isMobile ? '1rem' : '1.25rem'};
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
          padding: 1rem;
          overflow-x: auto;
          margin: 2rem 0;
        }
        .article-body pre code { background: none; border: none; padding: 0; }
        .share-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; border-radius: 4px; border: 1px solid ${theme.colors.border}; background: transparent; color: ${theme.colors.text}; cursor: pointer; font-size: ${isMobile ? '0.875rem' : '0.8125rem'}; font-weight: 500; font-family: ${theme.typography.fontFamily}; transition: all 0.2s; }
        .share-btn:hover { background: ${theme.colors.surface}; border-color: ${theme.colors.text}; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: ${theme.colors.textMuted}; text-decoration: none; font-size: ${isMobile ? '0.875rem' : '0.8125rem'}; font-weight: 500; letter-spacing: 0.05em; transition: color 0.2s; font-family: ${theme.typography.fontFamily}; }
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
        tags={getTagsArray(blog.tags).map(t => t.name)}
        jsonLd={createArticleSchema(blog)}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: isMobile ? '0.75rem 1rem 0.5rem' : '1rem 2rem 0.5rem',
      }}>
        <ol style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontSize: isMobile ? '0.75rem' : '0.875rem',
        }}>
          <li><Link to="/" style={{ color: theme.colors.textMuted }}>Home</Link></li>
          <li style={{ color: theme.colors.textMuted }}><ChevronRight size={14} /></li>
          {blog.category && (
            <>
              <li><Link to={`/?category=${blog.category.slug}`} style={{ color: theme.colors.textMuted }}>{blog.category.name}</Link></li>
              <li style={{ color: theme.colors.textMuted }}><ChevronRight size={14} /></li>
            </>
          )}
          <li style={{
            color: theme.colors.text,
            maxWidth: isMobile ? '70vw' : '520px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: isMobile ? 2 : 1,
            WebkitBoxOrient: 'vertical',
            lineHeight: isMobile ? '1.35' : '1.2',
          }}>
            {blog.title}
          </li>
        </ol>
      </nav>

      {/* Hero with cover image */}
      <div style={{
        position: 'relative',
        background: blog.cover_image ? theme.colors.text : theme.colors.background,
        borderBottom: `1px solid ${blog.cover_image ? 'transparent' : theme.colors.border}`,
      }}>
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
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${withAlpha(coverOverlayBase, 0.95)} 0%, ${withAlpha(coverOverlayBase, 0.5)} 60%, ${withAlpha(coverOverlayBase, 0.2)} 100%)` }} />
          </>
        )}
        <div style={{
          position: blog.cover_image ? 'absolute' : 'relative',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: '820px',
          margin: '0 auto',
          padding: blog.cover_image
            ? `0 ${isMobile ? '1rem' : '2rem'} ${isMobile ? '2rem' : '3.5rem'}`
            : `${isMobile ? '0.75rem' : '1rem'} ${isMobile ? '1rem' : '2rem'} ${isMobile ? '1.5rem' : '2rem'}`,
        }}>
          <Link
            to="/"
            className="back-link"
            style={{
              color: blog.cover_image ? withAlpha(coverTextColor, 0.7) : theme.colors.textMuted,
              marginBottom: blog.cover_image ? (isMobile ? '1rem' : '1.5rem') : (isMobile ? '0.5rem' : '0.75rem'),
              display: 'inline-flex',
            }}
          >
            <ArrowLeft size={14} /> Back
          </Link>
          {blog.category && (
            <div style={{ marginBottom: isMobile ? '0.75rem' : '1rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                background: theme.colors.accent,
                color: theme.colors.background,
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
            color: blog.cover_image ? coverTextColor : theme.colors.text,
            lineHeight: '1.15',
            margin: `0 0 ${blog.cover_image ? (isMobile ? '1rem' : '1.5rem') : (isMobile ? '0.75rem' : '1rem')}`,
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
            color: blog.cover_image ? withAlpha(coverTextColor, 0.65) : theme.colors.textMuted,
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

        {headings.length > 0 && (
          <>
            <button
              onClick={() => setShowToc(!showToc)}
              style={{
                position: 'fixed',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 50,
                padding: '0.75rem',
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '50%',
                cursor: 'pointer',
                boxShadow: theme.shadows.md,
                display: isMobile ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Table of Contents"
            >
              <List size={20} color={theme.colors.accent} />
            </button>

            {showToc && (
              <div style={{
                position: 'fixed',
                right: '3.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '280px',
                maxHeight: '60vh',
                overflowY: 'auto',
                padding: '1.25rem',
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px',
                boxShadow: theme.shadows.lg,
                zIndex: 50,
                display: isMobile ? 'none' : 'block',
              }}>
                <h4 style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: theme.colors.textMuted,
                  marginBottom: '1rem',
                }}>
                  Table of Contents
                </h4>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {headings.map((heading) => (
                    <button
                      key={heading.id}
                      onClick={() => {
                        scrollToHeading(heading.id);
                        setShowToc(false);
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '0.375rem 0.5rem',
                        background: activeHeading === heading.id ? theme.colors.accentLight : 'transparent',
                        border: 'none',
                        borderLeft: `2px solid ${activeHeading === heading.id ? theme.colors.accent : 'transparent'}`,
                        borderRadius: '0 4px 4px 0',
                        cursor: 'pointer',
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '0.8125rem',
                        color: activeHeading === heading.id ? theme.colors.accent : theme.colors.textSecondary,
                        fontWeight: activeHeading === heading.id ? 600 : 400,
                        marginLeft: heading.level === 3 ? '1rem' : '0',
                        transition: 'all 0.2s',
                      }}
                    >
                      {heading.text}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </>
        )}

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        <AdPlaceholder slot="article-mid-2" format="rectangle" />

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', marginTop: '1rem' }}>
            {tags.map((tag: Tag) => (
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

      {/* Comments Section */}
      <section style={{
        maxWidth: '820px',
        margin: '0 auto',
        padding: isMobile ? '2rem 1rem' : '3rem 2rem',
        borderTop: `1px solid ${theme.colors.border}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
        }}>
          <MessageCircle size={20} color={theme.colors.accent} />
          <h3 style={{
            fontFamily: theme.typography.displayFont,
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            fontWeight: 700,
            color: theme.colors.text,
            margin: 0,
          }}>
            Comments ({comments.length})
          </h3>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} style={{
          background: theme.colors.surface,
          padding: isMobile ? '1.25rem' : '1.5rem',
          borderRadius: '8px',
          border: `1px solid ${theme.colors.border}`,
          marginBottom: '2rem',
        }}>
          <h4 style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: theme.colors.text,
            marginBottom: '1rem',
          }}>
            Leave a Comment
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Your Name *"
              value={commentForm.name}
              onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
              required
              style={{
                padding: '0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '4px',
                background: theme.colors.background,
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily,
                fontSize: '0.9375rem',
              }}
            />
            <input
              type="email"
              placeholder="Your Email *"
              value={commentForm.email}
              onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
              required
              style={{
                padding: '0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '4px',
                background: theme.colors.background,
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily,
                fontSize: '0.9375rem',
              }}
            />
          </div>
          <textarea
            placeholder="Write your comment... *"
            value={commentForm.content}
            onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
            required
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '4px',
              background: theme.colors.background,
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
              fontSize: '0.9375rem',
              resize: 'vertical',
              marginBottom: '1rem',
              boxSizing: 'border-box',
            }}
          />
          {commentError && (
            <p style={{ color: theme.colors.error, fontSize: '0.875rem', marginBottom: '1rem' }}>
              {commentError}
            </p>
          )}
          {commentSuccess && (
            <p style={{ color: theme.colors.success, fontSize: '0.875rem', marginBottom: '1rem' }}>
              Your comment has been posted successfully!
            </p>
          )}
          <button
            type="submit"
            disabled={submittingComment}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: theme.colors.accent,
              color: theme.colors.background,
              border: 'none',
              borderRadius: '4px',
              fontFamily: theme.typography.fontFamily,
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: submittingComment ? 'not-allowed' : 'pointer',
              opacity: submittingComment ? 0.7 : 1,
            }}
          >
            <Send size={16} />
            {submittingComment ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {/* Comments List */}
        {loadingComments ? (
          <p style={{ color: theme.colors.textMuted, fontFamily: theme.typography.fontFamily }}>
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p style={{ color: theme.colors.textMuted, fontFamily: theme.typography.fontFamily }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {comments.map((comment) => (
              <div key={comment.id} style={{
                padding: '1.25rem',
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: theme.colors.accentLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.colors.accent,
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}>
                    {comment.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span style={{
                      fontFamily: theme.typography.fontFamily,
                      fontWeight: 600,
                      color: theme.colors.text,
                      fontSize: '0.9375rem',
                    }}>
                      {comment.author_name}
                    </span>
                    <span style={{
                      display: 'block',
                      fontFamily: theme.typography.fontFamily,
                      fontSize: '0.75rem',
                      color: theme.colors.textMuted,
                    }}>
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <p style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: '0.9375rem',
                  color: theme.colors.textSecondary,
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

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