import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckIcon, CopyIcon, TerminalIcon, FileCodeIcon } from 'lucide-react';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
        text-gray-400 hover:text-white hover:bg-white/10"
      aria-label={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <>
          <CheckIcon className="w-3.5 h-3.5 text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <CopyIcon className="w-3.5 h-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

const languageLabels: Record<string, { label: string; icon: 'terminal' | 'file' }> = {
  json: { label: 'JSON', icon: 'file' },
  yaml: { label: 'YAML', icon: 'file' },
  yml: { label: 'YAML', icon: 'file' },
  bash: { label: 'Bash', icon: 'terminal' },
  shell: { label: 'Shell', icon: 'terminal' },
  sh: { label: 'Shell', icon: 'terminal' },
  javascript: { label: 'JavaScript', icon: 'file' },
  typescript: { label: 'TypeScript', icon: 'file' },
  html: { label: 'HTML', icon: 'file' },
  css: { label: 'CSS', icon: 'file' },
  python: { label: 'Python', icon: 'file' },
  hcl: { label: 'HCL', icon: 'file' },
  terraform: { label: 'Terraform', icon: 'file' },
};

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy mt-12 mb-6 leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mt-14 mb-5 pb-3 border-b border-primary-dark/30 leading-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-heading text-xl md:text-2xl font-semibold text-navy mt-10 mb-4 leading-tight">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-heading text-lg md:text-xl font-semibold text-navy mt-8 mb-3 leading-tight">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-slate text-base md:text-lg leading-relaxed mb-6">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="text-slate text-base md:text-lg leading-relaxed mb-6 ml-1 space-y-2 list-none">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="text-slate text-base md:text-lg leading-relaxed mb-6 ml-1 space-y-2 list-decimal list-inside">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-slate leading-relaxed flex items-start">
              <span className="text-accent-pink mr-3 mt-1.5 flex-shrink-0">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                  <circle cx="4" cy="4" r="4" />
                </svg>
              </span>
              <span>{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-navy">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-navy/80">{children}</em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-pink font-medium hover:underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent-pink/60 bg-accent-pink/5 rounded-r-xl pl-6 pr-4 py-4 my-8 italic">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="my-12 border-none h-px bg-gradient-to-r from-transparent via-accent-pink/30 to-transparent" />
          ),
          img: ({ src, alt }) => (
            <figure className="my-8">
              <div className="rounded-xl overflow-hidden border border-primary-dark/20 shadow-warm">
                <img
                  src={src}
                  alt={alt || ''}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              {alt && (
                <figcaption className="text-center text-sm text-slate/70 mt-3 italic">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
          table: ({ children }) => (
            <div className="my-8 overflow-x-auto rounded-xl border border-primary-dark/20 shadow-warm">
              <table className="min-w-full divide-y divide-primary-dark/20">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-navy/5">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-navy">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-slate border-t border-primary-dark/10">
              {children}
            </td>
          ),
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');
            const isInline = !className && !codeString.includes('\n');

            if (isInline) {
              return (
                <code className="text-accent-lavender bg-accent-lavender/10 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }

            const langInfo = languageLabels[language] || { label: language || 'Code', icon: 'file' as const };

            return (
              <div className="my-8 rounded-xl overflow-hidden border border-[#2d2d2d] shadow-lg">
                {/* Editor Header */}
                <div className="flex items-center justify-between bg-[#1e1e1e] px-4 py-2.5 border-b border-[#2d2d2d]">
                  <div className="flex items-center gap-3">
                    {/* macOS window dots */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                      <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                      <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-mono">
                      {langInfo.icon === 'terminal' ? (
                        <TerminalIcon className="w-3.5 h-3.5" />
                      ) : (
                        <FileCodeIcon className="w-3.5 h-3.5" />
                      )}
                      {langInfo.label}
                    </div>
                  </div>
                  <CopyButton text={codeString} />
                </div>
                {/* Code Body */}
                <SyntaxHighlighter
                  style={oneDark}
                  language={language || 'text'}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    background: '#282c34',
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.7',
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: '"SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace',
                    },
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
