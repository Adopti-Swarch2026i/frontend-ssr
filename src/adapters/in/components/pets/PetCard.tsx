"use client";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import type { Pet } from "@/domain/entities/Pet";
import { formatDistanceToNow } from "@/lib/utils";

interface PetCardProps {
  pet: Pet;
}

const speciesLabels: Record<string, string> = {
  dog: "Perro",
  cat: "Gato",
  bird: "Ave",
  other: "Otro",
};

export function PetCard({ pet }: PetCardProps) {
  const speciesLabel = speciesLabels[pet.species] ?? pet.species;
  const subtitle = pet.breed ? `${speciesLabel} · ${pet.breed}` : speciesLabel;

  return (
    <Link href={`/pets/${pet.id}`} aria-label={`Ver reporte de ${pet.name}`}>
      <Card className="group overflow-hidden rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-border/60 bg-card">
        {/* Image */}
        <div className="aspect-[4/3] relative overflow-hidden bg-muted">
          <img
            src={pet.imageUrls[0] ?? "/placeholder-pet.svg"}
            alt={`Foto de ${pet.name}, ${speciesLabel} ${pet.status === "lost" ? "perdida" : "encontrada"}`}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-pet.svg";
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <StatusBadge status={pet.status} />
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-2">
          <div>
            <h3 className="font-heading font-bold text-lg leading-tight truncate text-foreground">
              {pet.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          </div>

          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{pet.city}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
              <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{formatDistanceToNow(pet.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
