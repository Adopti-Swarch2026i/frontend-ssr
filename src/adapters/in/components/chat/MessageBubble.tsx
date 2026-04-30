"use client";

import { cn } from "@/lib/utils";
import type { Message } from "@/domain/entities/Message";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = new Date(message.timestamp).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("flex animate-scale-in", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2",
          isOwn
            ? "bg-primary/90 text-primary-foreground rounded-br-md"
            : "bg-secondary rounded-bl-md"
        )}
      >
        {!isOwn && message.senderName && (
          <p className="text-xs font-medium mb-1">{message.senderName}</p>
        )}
        <p className="text-sm">{message.content}</p>
        <p
          className={cn(
            "text-xs mt-1",
            isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {time}
        </p>
      </div>
    </div>
  );
}
