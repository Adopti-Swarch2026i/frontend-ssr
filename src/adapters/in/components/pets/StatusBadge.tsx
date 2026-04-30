"use client";

import { Badge } from "@/components/ui/badge";

type DisplayStatus = "lost" | "found" | "reunited";

interface StatusBadgeProps {
  status: DisplayStatus;
}

const statusConfig: Record<
  DisplayStatus,
  { label: string; className: string; ping: boolean }
> = {
  lost: {
    label: "Perdida",
    className: [
      "bg-[hsl(var(--status-lost-bg))]",
      "text-[hsl(var(--status-lost))]",
      "border border-[hsl(var(--status-lost-border))]",
    ].join(" "),
    ping: true,
  },
  found: {
    label: "Encontrada",
    className: [
      "bg-[hsl(var(--status-found-bg))]",
      "text-[hsl(var(--status-found))]",
      "border border-[hsl(var(--status-found-border))]",
    ].join(" "),
    ping: false,
  },
  reunited: {
    label: "Reunida",
    className: [
      "bg-[hsl(var(--status-reunited-bg))]",
      "text-[hsl(var(--status-reunited))]",
      "border border-[hsl(var(--status-reunited-border))]",
    ].join(" "),
    ping: false,
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.found;

  return (
    <Badge
      className={`uppercase text-xs font-semibold tracking-wide rounded-full px-2.5 py-0.5 gap-1.5 hover:opacity-90 ${config.className}`}
    >
      {config.ping && (
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {config.label}
    </Badge>
  );
}

/** Colored left-border strip for cards. Used by ReportForm live preview. */
export function StatusStrip({ status }: { status: DisplayStatus }) {
  const colors: Record<DisplayStatus, string> = {
    lost: "hsl(var(--status-lost))",
    found: "hsl(var(--status-found))",
    reunited: "hsl(var(--status-reunited))",
  };
  return (
    <div
      className="absolute left-0 top-0 bottom-0 w-1"
      style={{ background: colors[status] ?? colors.found }}
      aria-hidden="true"
    />
  );
}
