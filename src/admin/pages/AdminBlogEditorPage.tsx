import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import { AdminSEO } from '../components/AdminSEO';
import { adminBlogService, BlogFormData } from '../services/adminBlogService';
import { imageService, ImageValidationError } from '../services/imageService';
import { Category } from '../../lib/supabase';
import { Save, X, Upload, AlertCircle, Loader, Crop } from 'lucide-react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import ReactCrop, { Crop as CropType, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { AdminPageShell } from '../components/AdminPageShell';

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
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageFile, setCropImageFile] = useState<File | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropType>();
  const [cropMode, setCropMode] = useState<'cover' | 'content'>('cover');
  const imgRef = useRef<HTMLImageElement>(null);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        imageService.validateImage(file);
        setCropImageFile(file);
        setCropMode('cover');
        setError('');
        const reader = new FileReader();
        reader.onload = () => {
          setCropImageSrc(reader.result as string);
          setShowCropModal(true);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        if (err instanceof ImageValidationError) {
          setError(err.message);
        } else {
          setError('Failed to process image');
        }
      }
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

      const { tags, ...blogDataWithoutTags } = formData;
      let tempImageUrl: string | null = null;

      if (isEditing && id) {
        let imageUrl = formData.cover_image;

        if (pendingImage) {
          imageUrl = await imageService.uploadBlogImage(id, pendingImage);
          if (formData.cover_image && formData.cover_image !== imageUrl) {
            await imageService.deleteImage(formData.cover_image);
          }
        }

        await adminBlogService.updateBlog(id, { ...blogDataWithoutTags, cover_image: imageUrl });
      } else {
        const newBlog = await adminBlogService.createBlog(blogDataWithoutTags);
        if (newBlog && pendingImage) {
          tempImageUrl = await imageService.uploadBlogImage(newBlog.id, pendingImage);
          await adminBlogService.updateBlog(newBlog.id, { cover_image: tempImageUrl });
        }
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

  const handleContentImageUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      imageService.validateImage(file);
      setCropImageFile(file);
      setCropMode('content');
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      if (err instanceof ImageValidationError) {
        setError(err.message);
      } else {
        setError('Failed to process image');
      }
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: '%', width: 80 }, naturalWidth / naturalHeight, naturalWidth, naturalHeight),
      naturalWidth,
      naturalHeight
    );
    setCrop(crop);
  };

  const applyCrop = async () => {
    if (!crop || !imgRef.current || !cropImageFile) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    ctx.drawImage(
      imgRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const croppedFile = new File([blob], cropImageFile.name, { type: cropImageFile.type });

      try {
        setUploadingImage(true);
        setShowCropModal(false);
        const blogId = isEditing ? id : 'temp-' + Date.now();
        const url = await imageService.uploadBlogImage(blogId, croppedFile);

        if (cropMode === 'cover') {
          setPendingImage(croppedFile);
          setPreviewImage(url);
          setFormData(prev => ({ ...prev, cover_image: url }));
        } else {
          const textarea = document.querySelector('.md-editor-text-input') as HTMLTextAreaElement;
          if (textarea) {
            const markdown = `\n![${cropImageFile.name}](${url})\n`;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            textarea.value = text.substring(0, start) + markdown + text.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + markdown.length;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      } catch {
        setError('Failed to upload image');
      } finally {
        setUploadingImage(false);
        setCropImageFile(null);
        setCropImageSrc(null);
      }
    }, cropImageFile.type);
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

  const imageUploadStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    border: `2px dashed ${theme.colors.border}`,
    backgroundColor: theme.colors.background,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  };

  const previewImageContainerStyle: React.CSSProperties = {
    width: '100%',
    marginBottom: theme.spacing.lg,
    boxSizing: 'border-box',
  };

  const previewImageStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    maxHeight: '400px',
    borderRadius: theme.borderRadius.md,
    objectFit: 'cover',
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
          <label style={labelStyle}>Cover Image</label>
          {previewImage ? (
            <div style={previewImageContainerStyle}>
              <div style={{ position: 'relative', width: '100%' }}>
                <img src={previewImage} alt="Preview" style={previewImageStyle} />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setPendingImage(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: theme.spacing.md,
                    right: theme.spacing.md,
                    padding: theme.spacing.sm,
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background,
                    borderRadius: theme.borderRadius.md,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ) : (
            <label style={imageUploadStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: theme.spacing.sm }}>
                <Upload size={24} style={{ color: theme.colors.primary }} />
                <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text }}>
                  Click to upload image
                </span>
                <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted }}>
                  (auto-compressed)
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
                disabled={saving}
              />
            </label>
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
          <div style={{ border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, overflow: 'hidden' }}>
            <MdEditor
              modelValue={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value || '' })}
              placeholder="Write your content here..."
              disabled={saving || uploadingImage}
              onUploadImg={handleContentImageUpload}
              toolbarsExclude={['github']}
              style={{ minHeight: '400px' }}
            />
          </div>
          {uploadingImage && (
            <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.primary, marginTop: theme.spacing.sm }}>
              Uploading image...
            </p>
          )}
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

      {showCropModal && cropImageSrc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.lg,
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            width: '90%',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
              <h3 style={{ color: theme.colors.text, margin: 0 }}>Crop Image</h3>
              <button
                type="button"
                onClick={() => {
                  setShowCropModal(false);
                  setCropImageFile(null);
                  setCropImageSrc(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.colors.text,
                  cursor: 'pointer',
                  padding: theme.spacing.sm,
                }}
              >
                <X size={24} />
              </button>
            </div>
            <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                aspect={undefined}
              >
                <img
                  ref={imgRef}
                  src={cropImageSrc}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  style={{ maxWidth: '100%', maxHeight: '60vh' }}
                />
              </ReactCrop>
            </div>
            <p style={{ color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm, marginTop: theme.spacing.md }}>
              Drag to select the area you want to keep. This is mandatory before uploading.
            </p>
            <div style={{ display: 'flex', gap: theme.spacing.md, justifyContent: 'flex-end', marginTop: theme.spacing.lg }}>
              <button
                type="button"
                onClick={() => {
                  setShowCropModal(false);
                  setCropImageFile(null);
                  setCropImageSrc(null);
                }}
                style={{
                  padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.border}`,
                  backgroundColor: 'transparent',
                  color: theme.colors.text,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCrop}
                style={{
                  padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                  borderRadius: theme.borderRadius.md,
                  border: 'none',
                  backgroundColor: theme.colors.accent,
                  color: theme.colors.background,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                }}
              >
                <Crop size={18} />
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .md-editor {
            background-color: ${theme.colors.surface} !important;
            border: none !important;
          }
          .md-editor-toolbar {
            background-color: ${theme.colors.background} !important;
            border-bottom: 1px solid ${theme.colors.border} !important;
          }
          .md-editor-toolbar-item {
            color: ${theme.colors.text} !important;
          }
          .md-editor-toolbar-item:hover {
            background-color: ${theme.colors.primaryLight} !important;
          }
          .md-editor-content {
            background-color: ${theme.colors.surface} !important;
          }
          .md-editor-text-input,
          .md-editor-text-prev {
            color: ${theme.colors.text} !important;
            background-color: ${theme.colors.surface} !important;
          }
        `}
      </style>
    </AdminPageShell>
    </>
  );
};
