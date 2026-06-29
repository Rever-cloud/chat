'use client';

import { useState, useEffect, useCallback } from 'react';
import { Chat } from '@/types';

const STORAGE_KEY = 'rverse-chat-history';

export function useChatHistory(userId: string | undefined) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setChats([]);
      setLoading(false);
      return;
    }
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${userId}`);
      setChats(stored ? JSON.parse(stored) : []);
    } catch {
      setChats([]);
    }
    setLoading(false);
  }, [userId]);

  const saveChats = useCallback((updatedChats: Chat[]) => {
    if (!userId) return;
    setChats(updatedChats);
    localStorage.setItem(`${STORAGE_KEY}-${userId}`, JSON.stringify(updatedChats));
  }, [userId]);

  const addChat = useCallback((chat: Chat) => {
    setChats(prev => {
      const updated = [chat, ...prev];
      if (userId) localStorage.setItem(`${STORAGE_KEY}-${userId}`, JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  const updateChat = useCallback((chatId: string, updates: Partial<Chat>) => {
    setChats(prev => {
      const updated = prev.map(c => c.id === chatId ? { ...c, ...updates } : c);
      if (userId) localStorage.setItem(`${STORAGE_KEY}-${userId}`, JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => {
      const updated = prev.filter(c => c.id !== chatId);
      if (userId) localStorage.setItem(`${STORAGE_KEY}-${userId}`, JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  const togglePin = useCallback((chatId: string) => {
    setChats(prev => {
      const updated = prev.map(c =>
        c.id === chatId ? { ...c, pinned: !c.pinned } : c
      );
      if (userId) localStorage.setItem(`${STORAGE_KEY}-${userId}`, JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  const renameChat = useCallback((chatId: string, title: string) => {
    updateChat(chatId, { title });
  }, [updateChat]);

  return {
    chats,
    loading,
    addChat,
    updateChat,
    deleteChat,
    togglePin,
    renameChat,
  };
}
