'use client';
export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, StopCircle, RefreshCw, Loader2, Plus, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import { useAuth } from '@/context/AuthContext';
import { useChatHistory } from '@/hooks/useChatHistory';
import { Message, Chat } from '@/types';

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const {
    chats, addChat, updateChat, deleteChat, togglePin, renameChat,
  } = useChatHistory(user?.id);

  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentChat = chats.find(c => c.id === currentChatId);
  const messages = currentChat?.messages || [];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addChat(newChat);
    setCurrentChatId(newChat.id);
    setStreamingContent('');
  }, [addChat]);

  const selectChat = useCallback((id: string) => {
    setCurrentChatId(id);
    setStreamingContent('');
  }, []);

  const generateTitle = (content: string) => {
    return content.slice(0, 50) + (content.length > 50 ? '...' : '');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming || !user) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    let chatId = currentChatId;
    let chat = currentChat;

    if (!chat) {
      const newChat: Chat = {
        id: crypto.randomUUID(),
        title: generateTitle(input),
        messages: [userMessage],
        pinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addChat(newChat);
      chatId = newChat.id;
      chat = newChat;
      setCurrentChatId(chatId);
    } else {
      const updatedMessages = [...chat.messages, userMessage];
      if (chatId) {
        updateChat(chatId, {
          messages: updatedMessages,
          title: chat.title === 'New Chat' ? generateTitle(input) : chat.title,
          updatedAt: new Date(),
        });
      }
    }

    setInput('');
    setIsStreaming(true);
    setStreamingContent('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          history: chat!.messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          fullContent += chunk;
          setStreamingContent(fullContent);
        }
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fullContent,
        timestamp: new Date(),
      };

      const finalChat = chats.find(c => c.id === chatId!) || chat!;
      if (chatId) {
        updateChat(chatId, {
          messages: [...finalChat.messages, assistantMessage],
          updatedAt: new Date(),
          title: finalChat.title === 'New Chat' ? generateTitle(input) : finalChat.title,
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      const finalChat = chats.find(c => c.id === chatId!) || chat!;
      if (chatId) {
        updateChat(chatId, {
          messages: [...finalChat.messages, errorMessage],
          updatedAt: new Date(),
        });
      }
    }

    setIsStreaming(false);
    setStreamingContent('');
  };

  const handleRegenerate = async () => {
    if (!currentChat || currentChat.messages.length < 2) return;
    const withoutLast = currentChat.messages.slice(0, -1);
    const lastUserMsg = [...withoutLast].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;
    setInput(lastUserMsg.content);
    updateChat(currentChat.id, { messages: withoutLast, updatedAt: new Date() });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-neonred" />
      </div>
    );
  }

  if (!user) return null;
  if (showSettings) {
    router.push('/settings');
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-black/15">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId || undefined}
        onNewChat={createNewChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
        onTogglePin={togglePin}
        onRenameChat={renameChat}
        onSettings={() => setShowSettings(true)}
      />
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {messages.length === 0 && !streamingContent ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
            <div className="mb-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-neonred/10 flex items-center justify-center glow-pulse mb-4 border border-neonred/20 shadow-[0_0_45px_rgba(255,30,30,0.20)]">
                <span className="text-5xl font-bold text-neonred">R</span>
              </div>
              <h1 className="tracking-[0.35em] text-white text-xl md:text-2xl font-semibold">
                REVERSE <span className="text-neonred">AI</span>
              </h1>
            </div>

            <div className="mb-8 inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-black/30 px-5 py-2 text-gray-200 backdrop-blur-xl shadow-[0_0_30px_rgba(255,30,30,0.12)]">
              <Crown size={16} className="text-neonred" />
              <span>Prime plan</span>
              <span className="text-gray-500">·</span>
              <span className="text-neonred">Manage</span>
            </div>

            <h2 className="mb-10 text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_0_18px_rgba(255,30,30,0.18)]">
              <span className="text-neonred">Let&apos;s build,</span> {user?.email?.split('@')[0] || 'Alex'}
            </h2>

            <form onSubmit={handleSubmit} className="w-full max-w-[760px]">
              <div className="relative min-h-[160px] rounded-[30px] border border-neonred/55 bg-black/35 p-5 text-left backdrop-blur-2xl shadow-[0_0_45px_rgba(255,30,30,0.22)] md:min-h-[190px]">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="How can I help you today?"
                  rows={3}
                  className="w-full resize-none bg-transparent text-lg text-white outline-none placeholder:text-white/45 md:text-xl"
                  disabled={isStreaming}
                  style={{ minHeight: '80px', maxHeight: '150px' }}
                />
                <button
                  type="button"
                  className="absolute bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/85 backdrop-blur hover:bg-white/10"
                >
                  <Plus size={28} />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-neonred/45 text-white shadow-[0_0_25px_rgba(255,30,30,0.35)] transition-colors hover:bg-neonred/70 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isStreaming ? <Loader2 size={21} className="animate-spin" /> : <Send size={21} />}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </AnimatePresence>
            {isStreaming && streamingContent && (
              <ChatMessage
                message={{
                  id: 'streaming',
                  role: 'assistant',
                  content: streamingContent,
                  timestamp: new Date(),
                }}
                isStreaming
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        <div className="border-t border-[rgba(255,30,30,0.1)] bg-black/25 p-3 md:p-4 backdrop-blur-md">
          <div className="mx-auto w-full max-w-[900px]">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Reverse AI..."
                rows={1}
                className="input-glass w-full pr-24 pl-4 py-4 resize-none text-sm md:text-base"
                disabled={isStreaming}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={() => setIsStreaming(false)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <StopCircle size={18} />
                  </button>
                ) : (
                  <>
                    {messages.length > 0 && (
                      <button
                        type="button"
                        onClick={handleRegenerate}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        <RefreshCw size={18} />
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="p-2 rounded-lg bg-neonred/20 text-neonred hover:bg-neonred/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </button>
                  </>
                )}
              </div>
            </form>
            <p className="text-[10px] text-gray-700 text-center mt-2">
              RVerse AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
