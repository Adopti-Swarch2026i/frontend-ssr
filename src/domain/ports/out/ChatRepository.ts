import type { Conversation } from "../../entities/Conversation";
import type { Message } from "../../entities/Message";

export interface ChatRepository {
  fetchConversations(userId: string): Promise<Conversation[]>;
  fetchMessages(conversationId: string): Promise<Message[]>;
  createConversation(participantIds: string[]): Promise<Conversation>;
  sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<void>;
  subscribeToMessages(
    conversationId: string,
    callback: (message: Message) => void
  ): () => void;
  connect(): void;
  disconnect(): void;
}
