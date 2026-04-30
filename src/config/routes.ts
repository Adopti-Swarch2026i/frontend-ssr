export const ROUTES = {
  LANDING: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PET_DETAIL: "/pets/:id",
  EDIT_REPORT: "/pets/:id/edit",
  CREATE_REPORT: "/report/new",
  CHAT: "/chat",
  CHAT_CONVERSATION: "/chat/:conversationId",
  PROFILE: "/profile",
} as const;

export function petDetailHref(id: string): string {
  return `/pets/${id}`;
}

export function petEditHref(id: string): string {
  return `/pets/${id}/edit`;
}

export function chatConversationHref(conversationId: string): string {
  return `/chat/${conversationId}`;
}
