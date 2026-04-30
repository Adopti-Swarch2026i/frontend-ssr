import type { ApolloClient } from "@apollo/client";
import {
  GET_CONVERSATIONS,
  GET_MESSAGES,
  CREATE_CONVERSATION,
} from "./queries";
import type { Conversation } from "@/domain/entities/Conversation";
import type { Message } from "@/domain/entities/Message";

export class ChatGraphQLAdapter {
  constructor(private client: ApolloClient) {}

  async fetchConversations(userId: string): Promise<Conversation[]> {
    const { data } = await this.client.query<{
      conversations: Conversation[];
    }>({
      query: GET_CONVERSATIONS,
      variables: { userId },
      fetchPolicy: "cache-first",
    });
    return data!.conversations;
  }

  async fetchMessages(conversationId: string): Promise<Message[]> {
    const { data } = await this.client.query<{ messages: Message[] }>({
      query: GET_MESSAGES,
      variables: { conversationId },
      fetchPolicy: "cache-first",
    });
    return data!.messages;
  }

  async createConversation(participantIds: string[]): Promise<Conversation> {
    const result = await this.client.mutate<{
      createConversation: Conversation;
    }>({
      mutation: CREATE_CONVERSATION,
      variables: { participantIds },
    });
    return result.data!.createConversation;
  }
}
