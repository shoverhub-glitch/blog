import { useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { codeBlockColors } from '../theme/theme';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock = ({ code, language = '', showLineNumbers = true }: CodeBlockProps) => {
  const codeRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!codeRef.current) return;

    const highlightCode = () => {
      const codeElement = codeRef.current;
      if (!codeElement) return;

      let highlighted = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      highlighted = highlighted.replace(
        /(\/\/.*$|#.*$|\/\*[\s\S]*?\*\/)/gm,
        '<span class="code-comment">$1</span>'
      );

      highlighted = highlighted.replace(
        /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw|new|this|super|extends|implements|interface|type|enum|public|private|protected|static|readonly|void|null|undefined|true|false)\b/g,
        '<span class="code-keyword">$1</span>'
      );

      highlighted = highlighted.replace(
        /\b(\d+\.?\d*)\b/g,
        '<span class="code-number">$1</span>'
      );

      highlighted = highlighted.replace(
        /(['"`])(?:(?!\1)[^\\]|\\.)*\1/g,
        '<span class="code-string">$1$&$1</span>'
      );

      codeElement.innerHTML = highlighted;
    };

    highlightCode();
  }, [code]);

  const lines = code.split('\n');

  return (
    <div style={{
      position: 'relative',
      margin: '2rem 0',
      borderRadius: '8px',
      overflow: 'hidden',
      background: codeBlockColors.background,
      fontFamily: '"Fira Code", "JetBrains Mono", monospace',
      fontSize: '0.875rem',
      lineHeight: 1.6,
    }}>
      {language && (
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.75rem',
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: codeBlockColors.language[language.toLowerCase() as keyof typeof codeBlockColors.language] || codeBlockColors.fallbackLanguage,
          zIndex: 1,
        }}>
          {language}
        </div>
      )}
      <div style={{
        display: 'flex',
        overflow: 'auto',
        padding: '1rem',
        paddingRight: language ? '4rem' : '1rem',
      }}>
        {showLineNumbers && (
          <div style={{
            userSelect: 'none',
            marginRight: '1rem',
            paddingRight: '0.75rem',
            borderRight: `1px solid ${codeBlockColors.gutterBorder}`,
            color: codeBlockColors.gutterText,
            textAlign: 'right',
            minWidth: '2rem',
          }}>
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        <pre style={{ margin: 0, flex: 1 }}>
          <code ref={codeRef}>{code}</code>
        </pre>
      </div>
      <style>{`
        .code-keyword { color: ${codeBlockColors.keyword}; }
        .code-string { color: ${codeBlockColors.string}; }
        .code-number { color: ${codeBlockColors.number}; }
        .code-comment { color: ${codeBlockColors.comment}; font-style: italic; }
      `}</style>
    </div>
  );
};

export const processContentWithCode = (content: string): string => {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  
  let processedContent = content;
  let match;
  const codeBlocks: { id: string; lang: string; code: string }[] = [];
  let index = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const lang = match[1] || 'text';
    const code = match[2].trim();
    const placeholder = `%%CODEBLOCK_${index}%%`;
    codeBlocks.push({ id: placeholder, lang, code });
    processedContent = processedContent.replace(match[0], placeholder);
    index++;
  }

  codeBlocks.forEach(({ id, lang, code }) => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    processedContent = processedContent.replace(
      id,
      `<pre class="code-block" data-language="${lang}"><code>${escapedCode}</code></pre>`
    );
  });

  return processedContent;
};
