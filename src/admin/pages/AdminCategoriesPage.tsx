import { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { AdminSEO } from '../components/AdminSEO';
import { Category } from '../../lib/supabase';
import { categoryService, CategoryFormData } from '../services/categoryService';
import { Plus, Pencil, Trash2, X, Loader2, Tag } from 'lucide-react';
import { AdminPageShell } from '../components/AdminPageShell';

export const AdminCategoriesPage = () => {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({ name: '', slug: '', description: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, slug: category.slug, description: category.description });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '' });
    }
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormError(null);
    setFormData({ name: '', slug: '', description: '' });
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingCategory && prev.name === name ? prev.slug : categoryService.generateSlug(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = categoryService.validateCategoryData(formData);
    if (error) {
      setFormError(error);
      return;
    }

    try {
      setFormLoading(true);
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
      } else {
        await categoryService.create(formData);
      }
      await loadCategories();
      closeModal();
    } catch (err) {
      setFormError('Failed to save category');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryService.delete(id);
      await loadCategories();
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete category');
      console.error(err);
    }
  };

  const buttonStyle = (variant: 'primary' | 'secondary' = 'primary'): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    border: 'none',
    backgroundColor: variant === 'primary' ? theme.colors.accent : 'transparent',
    color: variant === 'primary' ? '#fff' : theme.colors.text,
    cursor: 'pointer',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    textDecoration: 'none',
  });

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle: React.CSSProperties = {
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    textAlign: 'left',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textMuted,
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.background,
  };

  const tdStyle: React.CSSProperties = {
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    borderBottom: `1px solid ${theme.colors.border}`,
  };

  const actionButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    margin: theme.spacing.md,
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: theme.spacing.lg,
  };

  return (
    <>
      <AdminSEO title="Manage Categories" />
      <AdminPageShell
        title="Manage Categories"
        subtitle="Create and organize categories used across your blog."
        backTo="/shover-admin/dashboard"
        action={
          <button style={buttonStyle()} onClick={() => openModal()}>
            <Plus size={16} />
            Add Category
          </button>
        }
      >

      {error && (
        <div style={{ padding: theme.spacing.lg, backgroundColor: '#fef2f2', borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.xl, color: '#dc2626' }}>
          {error}
        </div>
      )}

      <div style={cardStyle}>
        {loading ? (
          <div style={{ padding: theme.spacing['3xl'], textAlign: 'center' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : categories.length === 0 ? (
          <div style={{ padding: theme.spacing['3xl'], textAlign: 'center', color: theme.colors.textMuted }}>
            <Tag size={48} style={{ marginBottom: theme.spacing.lg, opacity: 0.5 }} />
            <p>No categories yet. Create your first category!</p>
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Slug</th>
                <th style={thStyle}>Description</th>
                <th style={{ ...thStyle, width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: theme.typography.fontWeight.medium }}>{category.name}</span>
                  </td>
                  <td style={{ ...tdStyle, color: theme.colors.textMuted, fontFamily: 'monospace' }}>
                    {category.slug}
                  </td>
                  <td style={{ ...tdStyle, color: theme.colors.textSecondary, maxWidth: '300px' }}>
                    {category.description || '-'}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                      <button
                        style={actionButtonStyle}
                        onClick={() => openModal(category)}
                        title="Edit"
                      >
                        <Pencil size={16} color={theme.colors.primary} />
                      </button>
                      {deleteConfirm === category.id ? (
                        <div style={{ display: 'flex', gap: theme.spacing.xs, alignItems: 'center' }}>
                          <button
                            style={{ ...actionButtonStyle, backgroundColor: '#dc2626', color: '#fff' }}
                            onClick={() => handleDelete(category.id)}
                          >
                            Yes
                          </button>
                          <button
                            style={actionButtonStyle}
                            onClick={() => setDeleteConfirm(null)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          style={actionButtonStyle}
                          onClick={() => setDeleteConfirm(category.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} color="#dc2626" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xl }}>
              <h2 style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold }}>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button style={actionButtonStyle} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {formError && (
                <div style={{ padding: theme.spacing.md, backgroundColor: '#fef2f2', borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.lg, color: '#dc2626', fontSize: theme.typography.fontSize.sm }}>
                  {formError}
                </div>
              )}

              <div style={formGroupStyle}>
                <label style={labelStyle}>Name</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Technology"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Slug</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g., technology"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Description (optional)</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this category"
                />
              </div>

              <div style={{ display: 'flex', gap: theme.spacing.md, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  style={buttonStyle('secondary')}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...buttonStyle(), opacity: formLoading ? 0.6 : 1 }}
                  disabled={formLoading}
                >
                  {formLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
