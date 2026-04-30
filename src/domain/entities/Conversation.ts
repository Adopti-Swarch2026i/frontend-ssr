import type { Message } from "./Message";

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames?: string[];
  lastMessage?: Message;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}
