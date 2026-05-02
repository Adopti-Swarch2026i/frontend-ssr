"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageAutoSlider, type SliderItem } from "@/components/effects/image-auto-slider";
import { PetGrid } from "@/adapters/in/components/pets/PetGrid";
import { PetFilters } from "@/adapters/in/components/pets/PetFilters";
import { usePets } from "@/adapters/in/hooks/usePets";
import { ROUTES } from "@/config/routes";
import type {
  Pet,
  PetFilters as PetFiltersType,
  PetStats,
} from "@/domain/entities/Pet";

const PAGE_SIZE = 12;

interface DashboardPageProps {
  initialPets?: Pet[];
  initialTotal?: number;
  initialStats?: PetStats;
}

export function DashboardPage({
  initialPets,
  initialTotal,
  initialStats,
}: DashboardPageProps = {}) {
  const {
    pets: fetchedPets,
    total: fetchedTotal,
    loading,
    listPets,
    getStats,
  } = usePets();
  const [filters, setFilters] = useState<PetFiltersType>({});
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState<PetStats | null>(initialStats ?? null);

  const hasInitialPets = useRef(Boolean(initialPets));
  const hasInitialStats = useRef(Boolean(initialStats));

  const pets = hasInitialPets.current && fetchedPets.length === 0 && page === 1 && Object.keys(filters).length === 0
    ? (initialPets ?? [])
    : fetchedPets;
  const total = hasInitialPets.current && fetchedPets.length === 0 && page === 1 && Object.keys(filters).length === 0
    ? (initialTotal ?? 0)
    : fetchedTotal;

  useEffect(() => {
    if (hasInitialPets.current) {
      hasInitialPets.current = false;
      return;
    }
    listPets({ ...filters, page, pageSize: PAGE_SIZE });
  }, [filters, page, listPets]);

  const handleFiltersChange = (next: PetFiltersType) => {
    setPage(1);
    setFilters(next);
  };

  useEffect(() => {
    if (hasInitialStats.current) {
      hasInitialStats.current = false;
      return;
    }
    getStats().then((s) => {
      if (s) setStats(s);
    });
  }, [getStats]);

  const lostCount = stats?.totalLost ?? 0;
  const foundCount = stats?.totalFound ?? 0;
  const reunitedCount = stats?.totalReunited ?? 0;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fallbackItems: SliderItem[] = [
    { imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&fit=crop", petId: "", name: "Perro" },
    { imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&fit=crop", petId: "", name: "Gato" },
    { imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&fit=crop", petId: "", name: "Perros" },
    { imageUrl: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&fit=crop", petId: "", name: "Perro" },
    { imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&fit=crop", petId: "", name: "Perro" },
    { imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&fit=crop", petId: "", name: "Gato" },
    { imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&fit=crop", petId: "", name: "Gato" },
    { imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&fit=crop", petId: "", name: "Perro" },
    { imageUrl: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600&fit=crop", petId: "", name: "Perro" },
    { imageUrl: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&fit=crop", petId: "", name: "Perro" },
  ];

  const sliderItems = useMemo<SliderItem[]>(() => {
    const fromPets = pets.flatMap((p) =>
      p.imageUrls.filter(Boolean).map((url) => ({
        imageUrl: url,
        petId: p.id,
        name: p.name,
      })),
    );
    return fromPets.length > 0 ? fromPets : fallbackItems;
  }, [pets]);

  return (
    <div className="space-y-8">
      {/* Hero banner */}
      <div className="rounded-2xl bg-secondary paw-bg-pattern px-6 py-8 md:px-10 md:py-10 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Mascotas perdidas y encontradas
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-md">
              Juntos podemos ayudar a reunir familias con sus mascotas.
            </p>

            {stats && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "hsl(var(--status-lost))" }}
                >
                  {lostCount} {lostCount === 1 ? "perdida" : "perdidas"}
                </span>
                <span className="text-muted-foreground/40" aria-hidden="true">
                  ·
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "hsl(var(--status-found))" }}
                >
                  {foundCount} {foundCount === 1 ? "encontrada" : "encontradas"}
                </span>
                {reunitedCount > 0 && (
                  <>
                    <span className="text-muted-foreground/40" aria-hidden="true">
                      ·
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "hsl(var(--status-reunited))" }}
                    >
                      {reunitedCount} {reunitedCount === 1 ? "reunida" : "reunidas"}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <Link href={ROUTES.CREATE_REPORT} className="shrink-0">
            <Button size="lg" className="gap-2 shadow-sm w-full sm:w-auto">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Reportar mascota
            </Button>
          </Link>
        </div>
      </div>

      {/* Slider de mascotas reportadas */}
      <ImageAutoSlider items={sliderItems} />

      <PetFilters filters={filters} onChange={handleFiltersChange} />
      <PetGrid pets={pets} loading={loading} />

      {total > PAGE_SIZE && (
        <nav
          aria-label="Paginación"
          className="flex items-center justify-center gap-4 pt-4"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
          >
            Siguiente
          </Button>
        </nav>
      )}
    </div>
  );
}
