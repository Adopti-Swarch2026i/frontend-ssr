"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import axiosInstance from "@/adapters/out/api/axiosInstance";
import { LoadingSpinner } from "@/adapters/in/components/shared/LoadingSpinner";

interface BackendNotification {
  ID?: string;
  UserID: string;
  EventID: string;
  EventType: string;
  Channel: string;
  Status: string;
  Payload?: string;
  CreatedAt: string;
}

interface NotificationItem {
  id?: string;
  userId: string;
  eventId: string;
  eventType: string;
  channel: string;
  status: string;
  payload?: string;
  createdAt: string;
}

const EVENT_LABELS: Record<string, string> = {
  "pet.report.created": "Reporte creado",
  "pet.report.reunited": "Mascota reunida",
  "match.found": "Posible coincidencia",
  "chat.message.sent": "Nuevo mensaje",
};

const STATUS_BADGES: Record<string, string> = {
  sent: "bg-green-500/10 text-green-600",
  failed: "bg-red-500/10 text-red-600",
  failed_no_client: "bg-amber-500/10 text-amber-600",
};

const STATUS_LABELS: Record<string, string> = {
  sent: "enviada",
  failed: "fallida",
  failed_no_client: "no configurado",
};

const VISIBLE_STATUSES = new Set(["sent", "failed", "failed_no_client"]);

function mapNotification(n: BackendNotification): NotificationItem {
  return {
    id: n.ID,
    userId: n.UserID,
    eventId: n.EventID,
    eventType: n.EventType,
    channel: n.Channel,
    status: n.Status,
    payload: n.Payload,
    createdAt: n.CreatedAt,
  };
}

export function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // axiosInstance inyecta Bearer del usuario logueado. El backend
        // notification-service valida con Firebase Admin (A7) y usa el uid
        // del token; pasar ?userId es opcional.
        const res = await axiosInstance.get<{ data: BackendNotification[] }>(
          "/notifications",
          { params: { limit: 50 } }
        );
        if (cancelled) return;
        const list = Array.isArray(res.data?.data)
          ? res.data.data
              .map(mapNotification)
              .filter((n) => VISIBLE_STATUSES.has(n.status))
          : [];
        setItems(list);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las notificaciones."
        );
        setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="animate-fade-in max-w-3xl mx-auto py-6">
      <header className="mb-6 flex items-center gap-3">
        <Bell className="h-5 w-5 text-primary" aria-hidden />
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Notificaciones
        </h1>
        {items && (
          <span className="text-sm text-muted-foreground">{items.length}</span>
        )}
      </header>

      {items === null ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size={28} />
        </div>
      ) : error ? (
        <p className="text-center text-red-600 py-12">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Aún no tienes notificaciones.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => {
            const key = `${n.eventId}-${n.channel}`;
            const label = EVENT_LABELS[n.eventType] ?? n.eventType;
            const badge =
              STATUS_BADGES[n.status] ?? "bg-muted text-muted-foreground";
            return (
              <li
                key={key}
                className="rounded-lg border border-border bg-card p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{label}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      {n.channel}
                    </span>
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </time>
                </div>
                <span
                  className={`shrink-0 text-xs px-2 py-1 rounded-full ${badge}`}
                >
                  {STATUS_LABELS[n.status] ?? n.status}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
