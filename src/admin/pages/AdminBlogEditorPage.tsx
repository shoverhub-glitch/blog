import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import { AdminSEO } from '../components/AdminSEO';
import { adminBlogService, BlogFormData } from '../services/adminBlogService';
import { Category } from '../../lib/supabase';
import { Save, X, AlertCircle, Loader } from 'lucide-react';
import { AdminPageShell } from '../components/AdminPageShell';
import { MarkdownEditor } from '../components/MarkdownEditor';

export const AdminBlogEditorPage = () => {
  const { theme } = useTheme();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    category_id: null,
    published: false,
    featured: false,
    scheduled_at: null,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const cats = await adminBlogService.getCategories();
      setCategories(cats);

      if (isEditing && id) {
        const blog = await adminBlogService.getBlogById(id);
        if (blog) {
          const tagNames = blog.tags_list?.map((t) => t.name).join(', ') || '';
          setFormData({
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            excerpt: blog.excerpt,
            cover_image: blog.cover_image,
            category_id: blog.category_id,
            published: blog.published,
            featured: blog.featured,
            tags: tagNames,
          });
          setPreviewImage(blog.cover_image);
        }
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const validation = adminBlogService.validateBlogData(formData);
      if (validation) {
        setError(validation);
        setSaving(false);
        return;
      }

      if (isEditing && id) {
        await adminBlogService.updateBlog(id, { ...formData, cover_image: formData.cover_image || undefined });
      } else {
        await adminBlogService.createBlog(formData);
      }

      navigate('/shover-admin/blogs');
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = () => {
    const slug = adminBlogService.generateSlug(formData.title);
    setFormData({ ...formData, slug });
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: theme.spacing.xl,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    outline: 'none',
    transition: 'all 0.2s',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
  };

  const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.lg,
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const checkboxStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  };

  const saveButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    borderRadius: theme.borderRadius.md,
    border: 'none',
    backgroundColor: theme.colors.accent,
    color: theme.colors.background,
    cursor: saving ? 'not-allowed' : 'pointer',
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    opacity: saving ? 0.7 : 1,
    transition: 'all 0.2s',
    flex: '1 1 auto',
    minWidth: '120px',
    justifyContent: 'center',
  };

  const cancelButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: 'transparent',
    color: theme.colors.text,
    cursor: 'pointer',
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    transition: 'all 0.2s',
    flex: '1 1 auto',
    minWidth: '120px',
    justifyContent: 'center',
  };

  const errorStyle: React.CSSProperties = {
    backgroundColor: theme.colors.errorLight,
    border: `1px solid ${theme.colors.error}`,
    color: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `${theme.spacing.lg} ${theme.spacing.md}` }}>
        <p style={{ color: theme.colors.textMuted, textAlign: 'center', padding: theme.spacing.xl }}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <>
      <AdminSEO title={isEditing ? 'Edit Blog' : 'Create Blog'} />
      <AdminPageShell
        title={isEditing ? 'Edit Blog' : 'Create Blog'}
        subtitle="Write, organize, and publish content with categories, tags, and media."
        backTo="/shover-admin/blogs"
        maxWidth="1200px"
      >
      {error && (
        <div style={errorStyle}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onBlur={() => !formData.slug && generateSlug()}
            style={inputStyle}
            placeholder="Blog post title"
            disabled={saving}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Slug *</label>
          <div style={{ display: 'flex', gap: theme.spacing.sm, flexWrap: 'wrap' }}>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              style={{ ...inputStyle, flex: '1 1 260px' }}
              placeholder="url-friendly-slug"
              disabled={saving}
            />
            <button
              type="button"
              onClick={generateSlug}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.surface,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm,
                whiteSpace: 'nowrap',
              }}
              disabled={saving}
            >
              Auto-Generate
            </button>
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Cover Image URL</label>
          <input
            type="url"
            value={formData.cover_image}
            onChange={(e) => {
              setFormData({ ...formData, cover_image: e.target.value });
              setPreviewImage(e.target.value || null);
            }}
            style={inputStyle}
            placeholder="https://example.com/image.jpg"
            disabled={saving}
          />
          <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginTop: theme.spacing.xs }}>
            Paste a URL from external image hosting (Unsplash, Picsum, Imgur, etc.)
          </p>
          {previewImage && (
            <div style={{ marginTop: theme.spacing.md }}>
              <img src={previewImage} alt="Preview" style={{ maxWidth: '300px', borderRadius: theme.borderRadius.md }} />
              <button
                type="button"
                onClick={() => {
                  setPreviewImage(null);
                  setFormData({ ...formData, cover_image: '' });
                }}
                style={{
                  marginTop: theme.spacing.sm,
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  backgroundColor: theme.colors.errorLight,
                  color: theme.colors.error,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.xs,
                }}
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Excerpt *</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            style={{ ...inputStyle, minHeight: '100px' } as React.CSSProperties}
            placeholder="Short description for previews"
            disabled={saving}
          />
          <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginTop: theme.spacing.sm }}>
            {formData.excerpt.length}/300
          </p>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Content (Markdown) *</label>
          <MarkdownEditor
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            placeholder="Write your content here... Use markdown syntax (# for headings, **bold**, *italic*, etc.)"
            disabled={saving}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Category</label>
          <select
            value={formData.category_id || ''}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value || null })}
            style={selectStyle}
            disabled={saving}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Tags (comma separated)</label>
          <input
            type="text"
            value={formData.tags || ''}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            style={inputStyle}
            placeholder="react, javascript, tutorial"
            disabled={saving}
          />
          <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginTop: theme.spacing.sm }}>
            Enter tags separated by commas
          </p>
        </div>

        <div style={formGroupStyle}>
          <div style={checkboxContainerStyle}>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                disabled={saving}
              />
              <span style={{ fontSize: theme.typography.fontSize.sm }}>Publish</span>
            </label>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                disabled={saving}
              />
              <span style={{ fontSize: theme.typography.fontSize.sm }}>Featured</span>
            </label>
          </div>
        </div>

        {formData.published && (
          <div style={formGroupStyle}>
            <label style={labelStyle}>Schedule Publishing (optional)</label>
            <input
              type="datetime-local"
              value={formData.scheduled_at || ''}
              onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value || null })}
              style={inputStyle}
            />
            <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginTop: theme.spacing.xs }}>
              Leave empty to publish immediately, or set a future date/time
            </p>
          </div>
        )}

        <div style={buttonGroupStyle} className="admin-btn-group">
          <button
            type="button"
            onClick={() => navigate('/shover-admin/blogs')}
            style={cancelButtonStyle}
            disabled={saving}
          >
            <X size={18} />
            Cancel
          </button>
          <button type="submit" style={saveButtonStyle} disabled={saving}>
            {saving ? (
              <>
                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                {isEditing ? 'Update' : 'Create'} Blog
              </>
            )}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AdminPageShell>
    </>
  );
};