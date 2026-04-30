"use client";

import { useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ConversationList } from "@/adapters/in/components/chat/ConversationList";
import { ChatWindow } from "@/adapters/in/components/chat/ChatWindow";
import { useAuth } from "@/adapters/in/hooks/useAuth";
import { useChatContext } from "@/context/ChatContext";
import { chatConversationHref } from "@/config/routes";

export function ChatPage() {
  const { user } = useAuth();
  const params = useParams<{ conversationId?: string }>();
  const conversationId = params?.conversationId;
  const router = useRouter();
  const {
    conversations,
    messagesByConv,
    unreadByConv,
    loadMessages,
    sendMessage,
    setActiveConversation,
  } = useChatContext();

  useEffect(() => {
    if (!conversationId) {
      setActiveConversation(null);
      return;
    }
    setActiveConversation(conversationId);
    loadMessages(conversationId).catch((err) =>
      console.error("[chat] loadMessages failed", err)
    );
    return () => setActiveConversation(null);
  }, [conversationId, loadMessages, setActiveConversation]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      router.push(chatConversationHref(id));
    },
    [router]
  );

  const handleSend = (content: string) => {
    if (conversationId) {
      sendMessage(conversationId, content).catch((err) =>
        console.error("[chat] sendMessage failed", err)
      );
    }
  };

  const activeConversation = conversations.find((c) => c.id === conversationId);
  const otherIdx =
    activeConversation?.participantIds.findIndex((id) => id !== user?.id) ?? -1;
  const resolvedName =
    otherIdx >= 0
      ? activeConversation?.participantNames?.[otherIdx] ??
        activeConversation?.participantIds[otherIdx]
      : undefined;
  const participantName = conversationId
    ? resolvedName ?? "Conversación"
    : undefined;
  const messages = conversationId ? messagesByConv[conversationId] ?? [] : [];

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-lg border overflow-hidden">
      <div className="w-80 flex-shrink-0">
        <ConversationList
          conversations={conversations}
          activeId={conversationId}
          currentUserId={user?.id ?? ""}
          onSelect={handleSelectConversation}
          unreadByConv={unreadByConv}
        />
      </div>
      <div className="flex-1">
        <ChatWindow
          messages={messages}
          currentUserId={user?.id ?? ""}
          loading={false}
          participantName={participantName}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
