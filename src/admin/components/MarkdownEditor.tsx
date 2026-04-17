import { useState } from 'react';
import { Eye, Code } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MarkdownEditor = ({ value, onChange, placeholder, disabled }: MarkdownEditorProps) => {
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const { theme } = useTheme();

  const parseMarkdown = (text: string): string => {
    let html = text
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br/>');
    return html;
  };

  return (
    <div style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.5rem',
        borderBottom: `1px solid ${theme.colors.border}`,
        background: theme.colors.background,
      }}>
        <button
          type="button"
          onClick={() => setMode('write')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.375rem 0.75rem',
            border: 'none',
            borderRadius: '4px',
            background: mode === 'write' ? theme.colors.text : 'transparent',
            color: mode === 'write' ? theme.colors.background : theme.colors.textMuted,
            cursor: 'pointer',
            fontSize: '0.8125rem',
          }}
        >
          <Code size={14} /> Write
        </button>
        <button
          type="button"
          onClick={() => setMode('preview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.375rem 0.75rem',
            border: 'none',
            borderRadius: '4px',
            background: mode === 'preview' ? theme.colors.text : 'transparent',
            color: mode === 'preview' ? theme.colors.background : theme.colors.textMuted,
            cursor: 'pointer',
            fontSize: '0.8125rem',
          }}
        >
          <Eye size={14} /> Preview
        </button>
      </div>
      {mode === 'write' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%',
            minHeight: '400px',
            padding: '1rem',
            border: 'none',
            resize: 'vertical',
            fontFamily: 'monospace',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            background: theme.colors.surfaceHover,
            color: theme.colors.text,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      ) : (
        <div
          style={{
            minHeight: '400px',
            padding: '1rem',
            background: theme.colors.surfaceHover,
            color: theme.colors.text,
            lineHeight: 1.6,
            fontSize: '0.9375rem',
          }}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(value) || '<p style="color:var(--color-text-muted)">Nothing to preview</p>' }}
        />
      )}
    </div>
  );
};