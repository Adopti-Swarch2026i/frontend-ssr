import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { NotificationsPage } from "@/adapters/in/pages/NotificationsPage";

export const metadata: Metadata = {
  title: "Notificaciones — Adopti",
  description: "Historial de notificaciones de tu cuenta.",
};

export default async function Page() {
  // SSR solo verifica sesión y redirige si falta. La carga del historial
  // se hace en el Client Component porque el endpoint de notification-service
  // exige `Authorization: Bearer <idToken>` (events.md §6.3 / A7) y el
  // idToken solo está disponible en el cliente vía Firebase JS SDK.
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }
  return <NotificationsPage />;
}
