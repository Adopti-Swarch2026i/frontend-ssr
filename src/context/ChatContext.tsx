"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuthContext } from "./AuthContext";
import { useDependencies } from "./DependencyContext";
import type { Conversation } from "@/domain/entities/Conversation";
import type { Message } from "@/domain/entities/Message";
import { FindOrCreateConversationUseCase } from "@/domain/usecases/chat/FindOrCreateConversationUseCase";

interface ChatContextValue {
  conversations: Conversation[];
  messagesByConv: Record<string, Message[]>;
  unreadByConv: Record<string, number>;
  totalUnread: number;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  findOrCreateConversation: (otherUserId: string) => Promise<Conversation>;
  setActiveConversation: (conversationId: string | null) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const { chatRepository } = useDependencies();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messagesByConv, setMessagesByConv] = useState<
    Record<string, Message[]>
  >({});
  const [unreadByConv, setUnreadByConv] = useState<Record<string, number>>({});
  const activeIdRef = useRef<string | null>(null);
  const subsRef = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setMessagesByConv({});
      setUnreadByConv({});
      return;
    }
    chatRepository.connect();
    let cancelled = false;
    chatRepository
      .fetchConversations(user.id)
      .then((list) => {
        if (!cancelled) setConversations(list);
      })
      .catch((err) => console.error("[chat] fetchConversations failed", err));
    return () => {
      cancelled = true;
      for (const unsub of subsRef.current.values()) unsub();
      subsRef.current.clear();
      chatRepository.disconnect();
    };
  }, [user, chatRepository]);

  useEffect(() => {
    if (!user) return;
    const active = new Set(conversations.map((c) => c.id));
    for (const [id, unsub] of subsRef.current) {
      if (!active.has(id)) {
        unsub();
        subsRef.current.delete(id);
      }
    }
    for (const c of conversations) {
      if (subsRef.current.has(c.id)) continue;
      const unsub = chatRepository.subscribeToMessages(c.id, (msg) => {
        setMessagesByConv((prev) => {
          const existing = prev[c.id] ?? [];
          if (existing.some((m) => m.id === msg.id)) return prev;
          return { ...prev, [c.id]: [...existing, msg] };
        });
        if (activeIdRef.current !== c.id && msg.senderId !== user.id) {
          setUnreadByConv((prev) => ({
            ...prev,
            [c.id]: (prev[c.id] ?? 0) + 1,
          }));
        }
      });
      subsRef.current.set(c.id, unsub);
    }
  }, [conversations, chatRepository, user]);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      const msgs = await chatRepository.fetchMessages(conversationId);
      setMessagesByConv((prev) => {
        const live = prev[conversationId] ?? [];
        const byId = new Map<string, Message>();
        for (const m of msgs) byId.set(m.id, m);
        for (const m of live) byId.set(m.id, m);
        const merged = Array.from(byId.values()).sort((a, b) => {
          const ta =
            typeof a.timestamp === "number"
              ? a.timestamp
              : Date.parse(a.timestamp as unknown as string);
          const tb =
            typeof b.timestamp === "number"
              ? b.timestamp
              : Date.parse(b.timestamp as unknown as string);
          return ta - tb;
        });
        return { ...prev, [conversationId]: merged };
      });
    },
    [chatRepository]
  );

  const sendMessage = useCallback(
    async (conversationId: string, content: string) => {
      if (!user) throw new Error("User is not authenticated");
      const trimmed = content.trim();
      if (!trimmed) return;
      await chatRepository.sendMessage(conversationId, user.id, trimmed);
    },
    [chatRepository, user]
  );

  const findOrCreateConversation = useCallback(
    async (otherUserId: string): Promise<Conversation> => {
      if (!user) throw new Error("User is not authenticated");
      const useCase = new FindOrCreateConversationUseCase(chatRepository);
      const conversation = await useCase.execute(user.id, otherUserId);
      setConversations((prev) =>
        prev.some((c) => c.id === conversation.id)
          ? prev
          : [conversation, ...prev]
      );
      return conversation;
    },
    [chatRepository, user]
  );

  const setActiveConversation = useCallback((conversationId: string | null) => {
    activeIdRef.current = conversationId;
    if (conversationId) {
      setUnreadByConv((prev) =>
        prev[conversationId] ? { ...prev, [conversationId]: 0 } : prev
      );
    }
  }, []);

  const totalUnread = useMemo(
    () => Object.values(unreadByConv).reduce((a, b) => a + b, 0),
    [unreadByConv]
  );

  const value = useMemo<ChatContextValue>(
    () => ({
      conversations,
      messagesByConv,
      unreadByConv,
      totalUnread,
      loadMessages,
      sendMessage,
      findOrCreateConversation,
      setActiveConversation,
    }),
    [
      conversations,
      messagesByConv,
      unreadByConv,
      totalUnread,
      loadMessages,
      sendMessage,
      findOrCreateConversation,
      setActiveConversation,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return ctx;
}
