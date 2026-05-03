import type { Metadata } from "next";
import { matchesApiServer } from "@/adapters/out/api/MatchesApiServerAdapter";
import { SearchPage } from "@/adapters/in/pages/SearchPage";

export const metadata: Metadata = {
  title: "Búsqueda avanzada — Adopti",
  description: "Encuentra reportes con búsqueda full-text en Elasticsearch.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const pick = (k: string): string | undefined => {
    const v = sp[k];
    if (Array.isArray(v)) return v[0];
    return v;
  };

  const filters = {
    q: pick("q"),
    breed: pick("breed"),
    city: pick("city"),
    type: pick("type"),
    status: pick("status"),
  };
  const hasQuery = Object.values(filters).some(Boolean);

  const result = hasQuery
    ? await matchesApiServer.search(filters)
    : { total: 0, page: 1, pageSize: 0, results: [] };

  return <SearchPage initial={result} initialFilters={filters} />;
}
