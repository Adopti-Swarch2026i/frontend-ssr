"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { PetFilters as PetFiltersType } from "@/domain/entities/Pet";
import type { PetStatus } from "@/domain/entities/Pet";

interface PetFiltersProps {
  filters: PetFiltersType;
  onChange: (filters: PetFiltersType) => void;
}

const selectClass =
  "h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground " +
  "ring-offset-background cursor-pointer transition-colors " +
  "hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "disabled:cursor-not-allowed disabled:opacity-50";

export function PetFilters({ filters, onChange }: PetFiltersProps) {
  return (
    <div className="space-y-3 animate-fade-in" role="search" aria-label="Filtros de búsqueda">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        <span>Filtrar reportes</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Text search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input
            id="filter-search"
            aria-label="Buscar por nombre o raza"
            placeholder="Buscar por nombre, raza..."
            className="pl-9 h-10"
            value={filters.search ?? ""}
            onChange={(e) =>
              onChange({ ...filters, search: e.target.value || undefined })
            }
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-2">
          <label htmlFor="filter-status" className="sr-only">
            Estado
          </label>
          <select
            id="filter-status"
            className={selectClass}
            value={filters.status ?? "all"}
            onChange={(e) =>
              onChange({
                ...filters,
                status:
                  e.target.value === "all"
                    ? undefined
                    : (e.target.value as PetStatus),
              })
            }
          >
            <option value="all">Todos los estados</option>
            <option value="lost">Perdidas</option>
            <option value="found">Encontradas</option>
            <option value="reunited">Reunidas</option>
          </select>

          <label htmlFor="filter-species" className="sr-only">
            Especie
          </label>
          <select
            id="filter-species"
            className={selectClass}
            value={filters.species ?? "all"}
            onChange={(e) =>
              onChange({
                ...filters,
                species: e.target.value === "all" ? undefined : e.target.value,
              })
            }
          >
            <option value="all">Todas las especies</option>
            <option value="dog">Perro</option>
            <option value="cat">Gato</option>
            <option value="bird">Ave</option>
            <option value="other">Otro</option>
          </select>

          <Input
            id="filter-city"
            aria-label="Filtrar por ciudad"
            placeholder="Ciudad"
            className="w-36 h-10"
            value={filters.city ?? ""}
            onChange={(e) =>
              onChange({ ...filters, city: e.target.value || undefined })
            }
          />
        </div>
      </div>
    </div>
  );
}
