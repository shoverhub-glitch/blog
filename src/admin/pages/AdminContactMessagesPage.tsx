import { useEffect, useState } from 'react';
import { MessageSquare, ToggleLeft, ToggleRight, Trash2, CheckCircle, Clock, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { AdminSEO } from '../components/AdminSEO';
import { settingsService } from '../services/settingsService';
import { supabase } from '../../lib/supabase';
import { AdminPageShell } from '../components/AdminPageShell';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export const AdminContactMessagesPage = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const enabled = await settingsService.getSetting('admin_contact_messages_enabled');
      setMessagesEnabled(enabled);

      if (enabled) {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Failed to load contact messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMessages = async () => {
    const newValue = !messagesEnabled;
    const success = await settingsService.setSetting('admin_contact_messages_enabled', newValue);
    if (success) {
      setMessagesEnabled(newValue);
      if (!newValue) {
        setMessages([]);
      } else {
        loadData();
      }
    }
  };

  const handleToggleRead = async (message: ContactMessage) => {
    setTogglingId(message.id);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: !message.is_read })
        .eq('id', message.id);

      if (error) throw error;
      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, is_read: !m.is_read } : m
      ));
    } catch (error) {
      console.error('Failed to toggle read status:', error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete message:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    padding: '1.5rem',
    marginBottom: '1rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: '0.9375rem',
    outline: 'none',
  };

  const buttonStyle = (variant: 'primary' | 'danger' | 'ghost' = 'primary'): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: theme.borderRadius.md,
    border: variant === 'danger' ? `1px solid ${theme.colors.error}` : 'none',
    backgroundColor: variant === 'primary' ? theme.colors.accent : variant === 'danger' ? 'transparent' : 'transparent',
    color: variant === 'primary' ? theme.colors.background : variant === 'danger' ? theme.colors.error : theme.colors.text,
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'all 0.2s',
  });

  return (
    <>
      <AdminSEO title="Contact Messages" />
      <AdminPageShell
        title="Contact Messages"
        subtitle="View and manage messages from the contact form."
        backTo="/shover-admin/dashboard"
        action={
          <button
            onClick={handleToggleMessages}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${messagesEnabled ? theme.colors.success : theme.colors.error}`,
              backgroundColor: messagesEnabled ? theme.colors.successLight : theme.colors.errorLight,
              color: messagesEnabled ? theme.colors.success : theme.colors.error,
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {messagesEnabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            {messagesEnabled ? 'Enabled' : 'Disabled'}
          </button>
        }
      >

      {!messagesEnabled ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border}`,
        }}>
          <MessageSquare size={48} color={theme.colors.textMuted} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{
            fontFamily: theme.typography.displayFont,
            fontSize: '1.5rem',
            fontWeight: 600,
            color: theme.colors.text,
            marginBottom: '0.5rem',
          }}>
            Contact Messages Disabled
          </h3>
          <p style={{ color: theme.colors.textMuted, maxWidth: '400px', margin: '0 auto' }}>
            The contact form is currently disabled. Visitors will see a message that the form is not available.
          </p>
          <button
            onClick={handleToggleMessages}
            style={{ ...buttonStyle('primary'), marginTop: '1.5rem' }}
          >
            <ToggleRight size={18} />
            Enable Messages
          </button>
        </div>
      ) : loading ? (
        <p style={{ textAlign: 'center', color: theme.colors.textMuted, padding: '2rem' }}>
          Loading...
        </p>
      ) : (
        <>
          {messages.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ ...inputStyle, maxWidth: '400px' }}
              />
            </div>
          )}

          {filteredMessages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
            }}>
              <MessageSquare size={48} color={theme.colors.textMuted} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3 style={{
                fontFamily: theme.typography.displayFont,
                fontSize: '1.25rem',
                fontWeight: 600,
                color: theme.colors.text,
                marginBottom: '0.5rem',
              }}>
                {searchQuery ? 'No matching messages' : 'No messages yet'}
              </h3>
              <p style={{ color: theme.colors.textMuted }}>
                {searchQuery ? 'Try a different search term' : 'Contact form submissions will appear here'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    ...cardStyle,
                    opacity: message.is_read ? 0.7 : 1,
                    borderLeft: message.is_read ? `3px solid ${theme.colors.border}` : `3px solid ${theme.colors.accent}`,
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}>
                    <div>
                      <h4 style={{
                        fontFamily: theme.typography.displayFont,
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: theme.colors.text,
                        margin: 0,
                      }}>
                        {message.name}
                      </h4>
                      <p style={{
                        fontSize: '0.875rem',
                        color: theme.colors.textMuted,
                        margin: '0.25rem 0 0',
                      }}>
                        {message.email}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        color: theme.colors.textMuted,
                      }}>
                        <Clock size={12} />
                        {formatDate(message.created_at)}
                      </span>
                      {message.is_read ? (
                        <CheckCircle size={16} color={theme.colors.success} />
                      ) : (
                        <span style={{
                          padding: '0.125rem 0.5rem',
                          backgroundColor: theme.colors.accent,
                          color: theme.colors.background,
                          borderRadius: '999px',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}>
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: theme.colors.background,
                    borderRadius: theme.borderRadius.md,
                    marginBottom: '1rem',
                  }}>
                    <p style={{
                      fontSize: '0.75rem',
                      color: theme.colors.textMuted,
                      margin: '0 0 0.25rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      Subject
                    </p>
                    <p style={{
                      fontSize: '0.9375rem',
                      color: theme.colors.text,
                      fontWeight: 500,
                      margin: 0,
                    }}>
                      {message.subject}
                    </p>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{
                      fontSize: '0.75rem',
                      color: theme.colors.textMuted,
                      margin: '0 0 0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      Message
                    </p>
                    <p style={{
                      fontSize: '0.9375rem',
                      color: theme.colors.textSecondary,
                      lineHeight: 1.6,
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}>
                      {message.message}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleToggleRead(message)}
                      disabled={togglingId === message.id}
                      style={{ ...buttonStyle('ghost'), padding: '0.5rem' }}
                      title={message.is_read ? 'Mark as unread' : 'Mark as read'}
                    >
                      {message.is_read ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <a
                      href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
                      style={{ ...buttonStyle('ghost'), textDecoration: 'none' }}
                    >
                      Reply
                    </a>
                    <button
                      onClick={() => handleDelete(message.id)}
                      disabled={deletingId === message.id}
                      style={{ ...buttonStyle('danger'), padding: '0.5rem' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AdminPageShell>
    </>
  );
};