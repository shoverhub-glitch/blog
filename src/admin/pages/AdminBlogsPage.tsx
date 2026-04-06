import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, CreditCard as Edit, Plus, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { AdminSEO } from '../components/AdminSEO';
import { adminBlogService } from '../services/adminBlogService';
import { imageService } from '../services/imageService';
import { Blog } from '../../lib/supabase';
import { AdminPageShell } from '../components/AdminPageShell';

export const AdminBlogsPage = () => {
  const { theme } = useTheme();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  useEffect(() => {
    loadBlogs();
  }, [currentPage]);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const { blogs: data, total } = await adminBlogService.getAllAdminBlogs(currentPage, 20);
      setBlogs(data);
      setTotalPages(Math.ceil(total / 20));
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blog: Blog) => {
    if (!window.confirm(`Delete "${blog.title}"?`)) return;

    setDeletingId(blog.id);
    try {
      await imageService.deleteImagesByBlogId(blog.id);
      await adminBlogService.deleteBlog(blog.id, blog.cover_image);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
    } catch (error) {
      console.error('Failed to delete blog:', error);
      alert('Failed to delete blog');
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    setPublishingId(blog.id);
    try {
      await adminBlogService.updateBlog(blog.id, {
        published: !blog.published,
        published_at: !blog.published ? new Date().toISOString() : blog.published_at,
      });
      loadBlogs();
    } catch (error) {
      console.error('Failed to toggle publish:', error);
      alert('Failed to update blog');
    } finally {
      setPublishingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const createButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    border: 'none',
    backgroundColor: theme.colors.accent,
    color: theme.colors.background,
    cursor: 'pointer',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    textDecoration: 'none',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: theme.spacing.xl,
    minWidth: '500px',
  };

  const thStyle: React.CSSProperties = {
    padding: `${theme.spacing.md} ${theme.spacing.sm}`,
    textAlign: 'left',
    borderBottom: `2px solid ${theme.colors.border}`,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textMuted,
    backgroundColor: theme.colors.surface,
    whiteSpace: 'nowrap',
  };

  const tdStyle: React.CSSProperties = {
    padding: `${theme.spacing.md} ${theme.spacing.sm}`,
    borderBottom: `1px solid ${theme.colors.border}`,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  };

  const titleCellStyle: React.CSSProperties = {
    ...tdStyle,
    fontWeight: theme.typography.fontWeight.semibold,
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const statusBadgeStyle = (published: boolean): React.CSSProperties => ({
    display: 'inline-block',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    backgroundColor: published ? '#dcfce7' : '#fef3c7',
    color: published ? '#166534' : '#92400e',
    whiteSpace: 'nowrap',
  });

  const actionsStyle: React.CSSProperties = {
    ...tdStyle,
    display: 'flex',
    gap: theme.spacing.xs,
    alignItems: 'center',
    flexWrap: 'nowrap',
  };

  const iconButtonStyle = (disabled: boolean = false): React.CSSProperties => ({
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: theme.typography.fontSize.xs,
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s',
    minWidth: '32px',
  });

  const paginationStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing['2xl'],
    flexWrap: 'wrap',
  };

  const pageButtonStyle = (disabled: boolean): React.CSSProperties => ({
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: disabled ? theme.colors.surface : 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s',
  });

  return (
    <>
      <AdminSEO title="Manage Blogs" />
      <AdminPageShell
        title="Manage Blogs"
        subtitle="Review, publish, and maintain all blog posts."
        backTo="/shover-admin/dashboard"
        action={
          <Link to="/shover-admin/blogs/new" style={createButtonStyle}>
            <Plus size={18} />
            New Blog
          </Link>
        }
      >

      {loading ? (
        <p style={{ color: theme.colors.textMuted, textAlign: 'center', padding: theme.spacing.xl }}>
          Loading...
        </p>
      ) : blogs.length > 0 ? (
        <>
          <div style={{ overflowX: 'auto' }} className="admin-table-responsive">
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td style={titleCellStyle} title={blog.title}>
                      {blog.title}
                    </td>
                    <td style={tdStyle}>{blog.category?.name || 'Uncategorized'}</td>
                    <td style={tdStyle}>
                      <span style={statusBadgeStyle(blog.published)}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={tdStyle}>{formatDate(blog.created_at)}</td>
                    <td style={actionsStyle}>
                      <button
                        onClick={() => handleTogglePublish(blog)}
                        style={iconButtonStyle(publishingId === blog.id)}
                        disabled={publishingId === blog.id}
                        title={blog.published ? 'Unpublish' : 'Publish'}
                      >
                        {blog.published ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <Link
                        to={`/shover-admin/blogs/${blog.id}/edit`}
                        style={iconButtonStyle()}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog)}
                        style={{ ...iconButtonStyle(deletingId === blog.id), color: theme.colors.error }}
                        disabled={deletingId === blog.id}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={paginationStyle}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={pageButtonStyle(currentPage === 1)}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span style={{ color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={pageButtonStyle(currentPage === totalPages)}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: theme.spacing['3xl'] }}>
          <p style={{ color: theme.colors.textMuted, marginBottom: theme.spacing.lg }}>
            No blogs yet. Create your first post!
          </p>
          <Link to="/shover-admin/blogs/new" style={createButtonStyle}>
            <Plus size={18} />
            Create Blog
          </Link>
        </div>
      )}
    </AdminPageShell>
    </>
  );
};
