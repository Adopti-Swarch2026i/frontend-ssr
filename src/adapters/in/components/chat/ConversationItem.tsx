"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Conversation } from "@/domain/entities/Conversation";
import { formatDistanceToNow, cn } from "@/lib/utils";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  currentUserId: string;
  onClick: () => void;
  unreadCount?: number;
}

export function ConversationItem({
  conversation,
  isActive,
  currentUserId,
  onClick,
  unreadCount,
}: ConversationItemProps) {
  const otherIdx = conversation.participantIds.findIndex(
    (id) => id !== currentUserId,
  );
  const otherName =
    conversation.participantNames?.[otherIdx] ??
    conversation.participantIds[otherIdx] ??
    "Usuario";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:bg-accent/50 hover:shadow-sm",
        isActive && "bg-accent/60 shadow-sm"
      )}
    >
      <Avatar>
        <AvatarFallback>{otherName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm truncate">{otherName}</span>
          {conversation.lastMessage && (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(conversation.lastMessage.timestamp)}
            </span>
          )}
        </div>
        {conversation.lastMessage && (
          <p className="text-xs text-muted-foreground truncate">
            {conversation.lastMessage.content}
          </p>
        )}
      </div>
      {(() => {
        const count = unreadCount ?? conversation.unreadCount ?? 0;
        return count > 0 ? (
          <Badge
            variant="default"
            className="h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
          >
            {count}
          </Badge>
        ) : null;
      })()}
    </button>
  );
}
