"use client";

import { Client } from "@stomp/stompjs";
import { auth } from "../firebase/firebaseConfig";
import { clientEnv } from "@/lib/env";

export function createStompClient(): Client {
  const client = new Client({
    brokerURL: clientEnv.NEXT_PUBLIC_CHAT_WS_URL,
    connectHeaders: {},
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    beforeConnect: async () => {
      const user = auth?.currentUser;
      if (user) {
        const token = await user.getIdToken();
        client.connectHeaders = { Authorization: `Bearer ${token}` };
      }
    },
  });
  return client;
}
