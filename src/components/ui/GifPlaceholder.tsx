import { PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

interface GifPlaceholderProps {
  label?: string;
  aspectRatio?: "square" | "video";
  className?: string;
}

export function GifPlaceholder({
  label = "GIF de mascota",
  aspectRatio = "square",
  className,
}: GifPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-accent/30 bg-secondary/50",
        aspectRatio === "square" ? "aspect-square" : "aspect-video",
        className
      )}
    >
      <PawPrint className="h-12 w-12 text-accent/40 animate-bounce-gentle" />
      <p className="text-sm text-muted-foreground">{label}</p>
      {/* TODO: Replace with actual GIF via <img src="..."> */}
    </div>
  );
}
