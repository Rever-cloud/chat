'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export default function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 px-4 py-6 md:px-8 md:py-8 ${isUser ? '' : 'bg-white/[0.02]'}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
            <User size={16} className="text-gray-300" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-neonred/20 flex items-center justify-center shadow-neon">
            <span className="text-neonred font-bold text-sm">R</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 max-w-full">
        <div className="text-xs text-gray-500 mb-2 font-medium">
          {isUser ? 'You' : 'Reverse AI'}
        </div>
        <div className="chat-message-content">
          {isUser ? (
            <div className="text-gray-200 whitespace-pre-wrap break-words leading-relaxed text-sm md:text-base">
              {message.content}
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({ className, children, ...props }) {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="px-1.5 py-0.5 rounded bg-white/10 text-neonred text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <div className="relative group my-3">
                      <pre className="bg-black/50 border border-white/10 rounded-lg p-4 overflow-x-auto">
                        <code className={className} {...props}>{children}</code>
                      </pre>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(String(children));
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded bg-white/10 hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy size={14} className="text-gray-400" />
                      </button>
                    </div>
                  );
                },
                h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-3 mt-5">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold text-white mb-2 mt-4">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold text-white mb-2 mt-3">{children}</h3>,
                p: ({ children }) => <p className="text-gray-200 mb-3 leading-relaxed whitespace-pre-wrap break-words last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside text-gray-200 mb-3 space-y-1.5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside text-gray-200 mb-3 space-y-1.5">{children}</ol>,
                li: ({ children }) => <li className="text-gray-200 leading-relaxed">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-neonred/40 pl-4 italic text-gray-400 mb-3">{children}</blockquote>
                ),
                a: ({ children, href }) => (
                  <a href={href} className="text-neonred hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
                ),
                strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                em: ({ children }) => <em className="text-gray-300 italic">{children}</em>,
                hr: () => <hr className="border-white/10 my-4" />,
              } as Components}
            >
              {message.content}
            </ReactMarkdown>
          )}
          {isStreaming && (
            <span className="inline-flex gap-1 ml-1 mt-1">
              <span className="w-2 h-2 bg-neonred rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-neonred rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-neonred rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-[10px] text-gray-600">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-colors"
            title="Copy message"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
