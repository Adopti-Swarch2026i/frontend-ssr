"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { petDetailHref } from "@/config/routes";
import type { SearchResultItem } from "@/adapters/out/api/MatchesApiServerAdapter";

interface SearchPageProps {
  initial: {
    total: number;
    page: number;
    pageSize: number;
    results: SearchResultItem[];
  };
  initialFilters: {
    q?: string;
    breed?: string;
    city?: string;
    type?: string;
    status?: string;
  };
}

export function SearchPage({ initial, initialFilters }: SearchPageProps) {
  const router = useRouter();
  const [q, setQ] = useState(initialFilters.q ?? "");
  const [breed, setBreed] = useState(initialFilters.breed ?? "");
  const [city, setCity] = useState(initialFilters.city ?? "");
  const [type, setType] = useState(initialFilters.type ?? "");
  const [status, setStatus] = useState(initialFilters.status ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (breed) params.set("breed", breed);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (status) params.set("status", status);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-6">
      <header className="mb-6 flex items-center gap-3">
        <Search className="h-5 w-5 text-primary" aria-hidden />
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Búsqueda avanzada
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6"
      >
        <input
          name="q"
          placeholder="Texto libre"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          name="breed"
          placeholder="Raza"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          name="city"
          placeholder="Ciudad"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">Cualquier especie</option>
          <option value="dog">Perro</option>
          <option value="cat">Gato</option>
          <option value="other">Otro</option>
        </select>
        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">Cualquier estado</option>
          <option value="lost">Perdido</option>
          <option value="found">Encontrado</option>
          <option value="reunited">Reunido</option>
        </select>
        <button
          type="submit"
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Buscar
        </button>
      </form>

      {initial.total === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No hay resultados. Ajusta los filtros.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-3">
            {initial.total} resultado{initial.total === 1 ? "" : "s"}
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {initial.results.map((r) => (
              <li
                key={`${r.petId}-${r.reportId}`}
                className="rounded-lg border border-border bg-card p-4"
              >
                <Link
                  href={petDetailHref(String(r.reportId))}
                  className="block hover:opacity-90"
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-medium text-foreground">
                      {r.name ?? `Reporte #${r.petId}`}
                    </span>
                    <span className="text-xs uppercase text-muted-foreground">
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {[r.type, r.breed, r.color, r.city]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
