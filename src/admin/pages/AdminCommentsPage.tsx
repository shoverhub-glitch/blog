import { useEffect, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { AdminPageShell } from '../components/AdminPageShell';
import { supabase } from '../../lib/supabase';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MessageCircle, Check, X, Trash2, Search, Square, CheckSquare } from 'lucide-react';

interface Comment {
  id: string;
  blog_id: string;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  created_at: string;
  blog_title?: string;
}

export const AdminCommentsPage = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { loadComments(); }, [filter]);

  const loadComments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('comments')
        .select(`
          id, blog_id, parent_id, author_name, author_email, content, approved, created_at,
          blog:blogs(title)
        `)
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('approved', false);
      } else if (filter === 'approved') {
        query = query.eq('approved', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      const commentsWithBlog = (data || []).map((c: unknown) => {
        const comment = c as Comment & { blog: { title: string }[] };
        return {
          ...comment,
          blog_title: comment.blog?.[0]?.title || 'Unknown',
        };
      });
      setComments(commentsWithBlog);
      setSelectedComments(new Set());
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (commentId: string) => {
    await supabase.from('comments').update({ approved: true }).eq('id', commentId);
    loadComments();
  };

  const handleReject = async (commentId: string) => {
    await supabase.from('comments').update({ approved: false }).eq('id', commentId);
    loadComments();
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    await supabase.from('comments').delete().eq('id', commentId);
    loadComments();
  };

  const handleSelectAll = () => {
    if (selectedComments.size === filteredComments.length) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(filteredComments.map(c => c.id)));
    }
  };

  const handleSelectOne = (commentId: string) => {
    const newSet = new Set(selectedComments);
    if (newSet.has(commentId)) {
      newSet.delete(commentId);
    } else {
      newSet.add(commentId);
    }
    setSelectedComments(newSet);
  };

  const handleDeleteSelected = async () => {
    if (selectedComments.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedComments.size} comment(s)?`)) return;
    setDeleting(true);
    for (const id of selectedComments) {
      await supabase.from('comments').delete().eq('id', id);
    }
    setDeleting(false);
    loadComments();
  };

  const filteredComments = comments.filter(c => 
    !searchQuery || 
    c.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.blog_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rowStyle: React.CSSProperties = {
    borderBottom: `1px solid ${theme.colors.borderLight}`,
    background: theme.colors.surface,
  };

  const cellStyle: React.CSSProperties = {
    padding: isMobile ? theme.spacing.sm : theme.spacing.md,
    verticalAlign: 'top',
  };

  const actionBtnStyle: React.CSSProperties = {
    padding: '6px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <AdminPageShell title="Comments" subtitle="Manage blog comments">
      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '300px' }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: theme.colors.textMuted,
          }} />
          <input
            type="text"
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: `${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm} 2.5rem`,
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border}`,
              background: theme.colors.surface,
              color: theme.colors.text,
              fontSize: theme.typography.fontSize.sm,
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: theme.spacing.xs, flexWrap: 'wrap' }}>
          {(['all', 'pending', 'approved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${filter === f ? theme.colors.accent : theme.colors.border}`,
                background: filter === f ? theme.colors.accent : 'transparent',
                color: filter === f ? theme.colors.background : theme.colors.text,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: 500,
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedComments.size > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.md,
          padding: theme.spacing.md,
          background: theme.colors.accentLight,
          borderRadius: theme.borderRadius.md,
          marginBottom: theme.spacing.md,
        }}>
          <span style={{ fontSize: theme.typography.fontSize.sm, fontWeight: 600 }}>
            {selectedComments.size} selected
          </span>
          <button
            onClick={handleDeleteSelected}
            disabled={deleting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs,
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              borderRadius: theme.borderRadius.md,
              border: 'none',
              background: theme.colors.error,
              color: theme.colors.background,
              cursor: deleting ? 'not-allowed' : 'pointer',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: 600,
            }}
          >
            <Trash2 size={14} />
            {deleting ? 'Deleting...' : 'Delete Selected'}
          </button>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredComments.length === 0 ? (
        <div style={{
          padding: theme.spacing.xl,
          textAlign: 'center',
          color: theme.colors.textMuted,
        }}>
          <MessageCircle size={48} style={{ opacity: 0.3, marginBottom: theme.spacing.md }} />
          <p>No comments found</p>
        </div>
      ) : (
        <div style={{
          background: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border}`,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: cellStyle.padding,
            borderBottom: `1px solid ${theme.colors.border}`,
            gap: theme.spacing.md,
            flexWrap: 'wrap',
          }}>
            <button
              onClick={handleSelectAll}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: theme.colors.text,
                padding: '4px',
              }}
              title={selectedComments.size === filteredComments.length ? 'Deselect All' : 'Select All'}
            >
              {selectedComments.size === filteredComments.length ? <CheckSquare size={20} /> : <Square size={20} />}
            </button>
            <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.textMuted }}>
              {filteredComments.length} comments
            </span>
          </div>

          {/* Comments */}
          {filteredComments.map((comment) => (
            <div key={comment.id} style={rowStyle}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: isMobile ? theme.spacing.sm : theme.spacing.md,
                gap: theme.spacing.md,
              }}>
                {/* Checkbox */}
                <button
                  onClick={() => handleSelectOne(comment.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: theme.colors.text,
                    padding: '4px',
                    flexShrink: 0,
                  }}
                >
                  {selectedComments.has(comment.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: theme.spacing.sm,
                    flexWrap: 'wrap',
                    marginBottom: theme.spacing.xs,
                  }}>
                    <div>
                      <p style={{ fontWeight: 600, margin: 0, fontSize: isMobile ? '0.875rem' : theme.typography.fontSize.sm }}>
                        {comment.author_name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: theme.colors.textMuted, margin: '2px 0 0' }}>
                        {comment.author_email}
                      </p>
                    </div>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      background: comment.approved ? theme.colors.successLight : theme.colors.accentLight,
                      color: comment.approved ? theme.colors.success : theme.colors.accent,
                    }}>
                      {comment.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>

                  <p style={{ 
                    margin: 0, 
                    lineHeight: 1.5, 
                    fontSize: isMobile ? '0.8125rem' : theme.typography.fontSize.sm,
                    wordBreak: 'break-word',
                  }}>
                    {comment.content}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                    marginTop: theme.spacing.sm,
                    flexWrap: 'wrap',
                  }}>
                    <span style={{ fontSize: '0.75rem', color: theme.colors.textMuted }}>
                      {comment.blog_title}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: theme.colors.textMuted }}>
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: theme.spacing.xs, marginTop: theme.spacing.sm }}>
                    {!comment.approved && (
                      <button
                        onClick={() => handleApprove(comment.id)}
                        title="Approve"
                        style={{ ...actionBtnStyle, background: theme.colors.successLight, color: theme.colors.success }}
                      >
                        <Check size={14} />
                      </button>
                    )}
                    {comment.approved && (
                      <button
                        onClick={() => handleReject(comment.id)}
                        title="Reject"
                        style={{ ...actionBtnStyle, background: theme.colors.accentLight, color: theme.colors.accent }}
                      >
                        <X size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      title="Delete"
                      style={{ ...actionBtnStyle, background: theme.colors.errorLight, color: theme.colors.error }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminCommentsPage;
