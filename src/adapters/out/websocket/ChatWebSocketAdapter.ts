"use client";

import type { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import type { Message } from "@/domain/entities/Message";

type Subscriber = {
  conversationId: string;
  callback: (message: Message) => void;
  subscription?: StompSubscription;
};

export class ChatWebSocketAdapter {
  private subscribers = new Set<Subscriber>();
  private pendingSends: Array<{
    conversationId: string;
    senderId: string;
    content: string;
  }> = [];

  constructor(private client: Client) {
    const prevOnConnect = this.client.onConnect;
    this.client.onConnect = (frame) => {
      prevOnConnect?.(frame);
      for (const sub of this.subscribers) {
        sub.subscription = this.rawSubscribe(sub.conversationId, sub.callback);
      }
      const queued = this.pendingSends.splice(0);
      for (const m of queued) this.rawPublish(m);
    };
  }

  connect(): void {
    if (!this.client.active) this.client.activate();
  }

  disconnect(): void {
    for (const sub of this.subscribers) sub.subscription?.unsubscribe();
    this.subscribers.clear();
    this.pendingSends = [];
    if (this.client.active) this.client.deactivate();
  }

  sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ): void {
    const payload = { conversationId, senderId, content };
    if (this.client.connected) {
      this.rawPublish(payload);
    } else {
      this.pendingSends.push(payload);
      this.connect();
    }
  }

  subscribeToMessages(
    conversationId: string,
    callback: (message: Message) => void
  ): () => void {
    const sub: Subscriber = { conversationId, callback };
    if (this.client.connected) {
      sub.subscription = this.rawSubscribe(conversationId, callback);
    } else {
      this.connect();
    }
    this.subscribers.add(sub);
    return () => {
      sub.subscription?.unsubscribe();
      this.subscribers.delete(sub);
    };
  }

  private rawPublish(payload: {
    conversationId: string;
    senderId: string;
    content: string;
  }): void {
    this.client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(payload),
    });
  }

  private rawSubscribe(
    conversationId: string,
    callback: (message: Message) => void
  ): StompSubscription {
    return this.client.subscribe(
      `/topic/chat/${conversationId}`,
      (stompMessage: IMessage) => {
        const message: Message = JSON.parse(stompMessage.body);
        callback(message);
      }
    );
  }
}
