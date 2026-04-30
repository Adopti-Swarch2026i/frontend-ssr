import type { ChatRepository } from "../../ports/out/ChatRepository";
import type { Conversation } from "../../entities/Conversation";

export class FindOrCreateConversationUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(
    currentUserId: string,
    otherUserId: string
  ): Promise<Conversation> {
    if (!currentUserId || !otherUserId) {
      throw new Error("Both user ids are required");
    }
    if (currentUserId === otherUserId) {
      throw new Error("Cannot start a conversation with yourself");
    }

    const existing = await this.chatRepository.fetchConversations(
      currentUserId
    );
    const match = existing.find(
      (c) =>
        c.participantIds.length === 2 &&
        c.participantIds.includes(currentUserId) &&
        c.participantIds.includes(otherUserId)
    );
    if (match) return match;

    return this.chatRepository.createConversation([currentUserId, otherUserId]);
  }
}
