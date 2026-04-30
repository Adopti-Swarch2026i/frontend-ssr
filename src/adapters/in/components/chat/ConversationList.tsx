"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ConversationItem } from "./ConversationItem";
import { EmptyState } from "../shared/EmptyState";
import type { Conversation } from "@/domain/entities/Conversation";
import { MessageCircle, Search } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  currentUserId: string;
  onSelect: (id: string) => void;
  unreadByConv?: Record<string, number>;
}

export function ConversationList({
  conversations,
  activeId,
  currentUserId,
  onSelect,
  unreadByConv,
}: ConversationListProps) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) => {
    const haystack = [
      ...(c.participantNames ?? []),
      ...c.participantIds,
    ];
    return haystack.some((n) =>
      n.toLowerCase().includes(search.toLowerCase()),
    );
  });

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-3 border-b">
        <h2 className="font-semibold mb-2">Conversaciones</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-8 h-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filtered.length === 0 ? (
            <EmptyState
              title="Sin conversaciones"
              icon={<MessageCircle size={32} />}
            />
          ) : (
            filtered.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeId}
                currentUserId={currentUserId}
                onClick={() => onSelect(conv.id)}
                unreadCount={unreadByConv?.[conv.id] ?? conv.unreadCount ?? 0}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
