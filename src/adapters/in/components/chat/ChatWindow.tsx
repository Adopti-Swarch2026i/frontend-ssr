"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { EmptyState } from "../shared/EmptyState";
import type { Message } from "@/domain/entities/Message";
import { MessageCircle } from "lucide-react";

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
  loading: boolean;
  participantName?: string;
  onSend: (content: string) => void;
}

export function ChatWindow({
  messages,
  currentUserId,
  loading,
  participantName,
  onSend,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!participantName) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyState
          title="Selecciona una conversacion"
          description="Elige una conversacion para empezar a chatear"
          icon={<MessageCircle size={48} />}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b font-semibold">
        {participantName}
      </div>
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === currentUserId}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>
      <MessageInput onSend={onSend} />
    </div>
  );
}
