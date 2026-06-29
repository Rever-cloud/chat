'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MessageSquare, Search, Settings,
  LogOut, Pin, Trash2, Menu, X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Chat } from '@/types';

interface SidebarProps {
  chats: Chat[];
  currentChatId?: string;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onTogglePin: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  onSettings: () => void;
}

export default function Sidebar({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onTogglePin,
  onRenameChat,
  onSettings,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { signOut } = useAuth();

  const pinned = chats.filter(c => c.pinned);
  const filtered = chats.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleDoubleClick = (chat: Chat) => {
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <motion.div
      initial={{ width: collapsed ? 64 : 280 }}
      animate={{ width: collapsed ? 64 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative hidden h-screen bg-[rgba(5,5,5,0.82)] backdrop-blur-xl border-r border-[rgba(255,30,30,0.18)] md:flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-[rgba(255,30,30,0.1)]">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-neonred/20 flex items-center justify-center shadow-neon">
              <span className="text-neonred font-bold text-lg">R</span>
            </div>
            <span className="text-white font-semibold text-sm">RVerse AI</span>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neonred/10 hover:bg-neonred/20 border border-neonred/20 text-neonred transition-all duration-200 group"
        >
          <Plus size={16} />
          {!collapsed && <span className="text-sm font-medium">New Chat</span>}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 mb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus-within:border-neonred/40 transition-colors">
            <Search size={14} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
            />
          </div>
        </div>
      )}

      {/* Pinned Chats */}
      {!collapsed && pinned.length > 0 && (
        <div className="px-3 mb-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 px-2">Pinned</p>
          {pinned.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === currentChatId}
              collapsed={false}
              onSelect={onSelectChat}
              onDelete={onDeleteChat}
              onTogglePin={onTogglePin}
              onDoubleClick={handleDoubleClick}
              editingId={editingId}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              onRename={handleRename}
            />
          ))}
          <div className="border-t border-white/5 my-2" />
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-0.5 scrollbar-thin">
        <AnimatePresence>
          {!collapsed && sorted.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === currentChatId}
              collapsed={false}
              onSelect={onSelectChat}
              onDelete={onDeleteChat}
              onTogglePin={onTogglePin}
              onDoubleClick={handleDoubleClick}
              editingId={editingId}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              onRename={handleRename}
            />
          ))}
        </AnimatePresence>
        {!collapsed && sorted.length === 0 && (
          <p className="text-xs text-gray-600 text-center py-4">No chats yet</p>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-[rgba(255,30,30,0.1)] space-y-1">
        <button
          onClick={onSettings}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <Settings size={16} />
          {!collapsed && <span>Settings</span>}
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors text-sm"
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
}

function ChatItem({
  chat, isActive, collapsed, onSelect, onDelete, onTogglePin,
  onDoubleClick, editingId, editTitle, setEditTitle, onRename,
}: {
  chat: Chat;
  isActive: boolean;
  collapsed: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDoubleClick: (chat: Chat) => void;
  editingId: string | null;
  editTitle: string;
  setEditTitle: (v: string) => void;
  onRename: (id: string) => void;
}) {
  const isEditing = editingId === chat.id;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-neonred/10 border border-neonred/20'
          : 'hover:bg-white/5 border border-transparent'
      }`}
      onClick={() => !isEditing && onSelect(chat.id)}
      onDoubleClick={() => onDoubleClick(chat)}
    >
      <MessageSquare size={14} className="text-gray-500 shrink-0" />
      {!collapsed && (
        <>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => onRename(chat.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onRename(chat.id);
                if (e.key === 'Escape') onRename(chat.id);
              }}
              className="flex-1 bg-transparent text-sm text-white outline-none border-b border-neonred/40"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-1 text-sm text-gray-300 truncate">{chat.title}</span>
          )}
          <div className="hidden group-hover:flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePin(chat.id); }}
              className={`p-1 rounded hover:bg-white/10 transition-colors ${
                chat.pinned ? 'text-neonred' : 'text-gray-600'
              }`}
            >
              <Pin size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(chat.id); }}
              className="p-1 rounded hover:bg-red-500/20 text-gray-600 hover:text-red-400 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
