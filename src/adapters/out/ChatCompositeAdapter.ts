"use client";

import type { ChatRepository } from "@/domain/ports/out/ChatRepository";
import type { ChatGraphQLAdapter } from "./graphql/ChatGraphQLAdapter";
import type { ChatWebSocketAdapter } from "./websocket/ChatWebSocketAdapter";
import type { Conversation } from "@/domain/entities/Conversation";
import type { Message } from "@/domain/entities/Message";

export class ChatCompositeAdapter implements ChatRepository {
  constructor(
    private gqlAdapter: ChatGraphQLAdapter,
    private wsAdapter: ChatWebSocketAdapter
  ) {}

  fetchConversations(userId: string): Promise<Conversation[]> {
    return this.gqlAdapter.fetchConversations(userId);
  }

  fetchMessages(conversationId: string): Promise<Message[]> {
    return this.gqlAdapter.fetchMessages(conversationId);
  }

  createConversation(participantIds: string[]): Promise<Conversation> {
    return this.gqlAdapter.createConversation(participantIds);
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<void> {
    this.wsAdapter.sendMessage(conversationId, senderId, content);
  }

  subscribeToMessages(
    conversationId: string,
    callback: (message: Message) => void
  ): () => void {
    return this.wsAdapter.subscribeToMessages(conversationId, callback);
  }

  connect(): void {
    this.wsAdapter.connect();
  }

  disconnect(): void {
    this.wsAdapter.disconnect();
  }
}
