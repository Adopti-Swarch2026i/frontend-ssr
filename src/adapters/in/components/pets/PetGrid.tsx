"use client";

import { PetCard } from "./PetCard";
import { EmptyState } from "../shared/EmptyState";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import type { Pet } from "@/domain/entities/Pet";
import { PawPrint } from "lucide-react";

interface PetGridProps {
  pets: Pet[];
  loading: boolean;
}

export function PetGrid({ pets, loading }: PetGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <EmptyState
        title="No se encontraron mascotas"
        description="Intenta ajustar los filtros o crea un nuevo reporte"
        icon={<PawPrint size={48} className="text-muted-foreground/40" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {pets.map((pet, i) => (
        <div
          key={pet.id}
          className="animate-scale-in"
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
        >
          <PetCard pet={pet} />
        </div>
      ))}
    </div>
  );
}
