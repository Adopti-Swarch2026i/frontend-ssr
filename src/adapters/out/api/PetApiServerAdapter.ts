import "server-only";
import type {
  PaginatedPets,
  Pet,
  PetFilters,
  PetStats,
} from "@/domain/entities/Pet";
import { getServerEnv } from "@/lib/env";
import { mapHttpError } from "./errors";
import { mapReportToPet } from "./PetApiAdapter";

interface BackendReport {
  id: number;
  status: string;
  location: string;
  city: string;
  description: string;
  owner_name: string | null;
  owner_phone: string | null;
  owner_id: string;
  created_at: string;
  pet: {
    id: number;
    name: string;
    type: string;
    breed: string | null;
    color: string | null;
    age: string | null;
    image_urls: string[] | null;
  };
}

interface PaginatedResponse {
  total: number;
  page: number;
  page_size: number;
  results: BackendReport[];
}

interface FetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

async function fetchJson<T>(
  path: string,
  searchParams?: Record<string, string | number>,
  opts: FetchOptions = {}
): Promise<T> {
  const env = getServerEnv();
  const url = new URL(env.PETS_API_URL_INTERNAL + path);
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url, {
    next:
      opts.revalidate === false
        ? undefined
        : { revalidate: opts.revalidate ?? 60, tags: opts.tags },
    cache: opts.revalidate === false ? "no-store" : undefined,
  });
  if (!res.ok) {
    let detail: string | undefined;
    try {
      const body = (await res.json()) as { detail?: string; message?: string };
      detail = body.detail ?? body.message;
    } catch {}
    throw mapHttpError(res.status, detail);
  }
  return (await res.json()) as T;
}

export const petApiServer = {
  async findAll(filters?: PetFilters): Promise<PaginatedPets> {
    const params: Record<string, string | number> = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.species) params.type = filters.species;
    if (filters?.city) params.city = filters.city;
    if (filters?.search) params.search = filters.search;
    if (filters?.reporterId) params.owner_id = filters.reporterId;
    if (filters?.page) params.page = filters.page;
    if (filters?.pageSize) params.page_size = filters.pageSize;
    const data = await fetchJson<PaginatedResponse>("/pets", params, {
      revalidate: 30,
      tags: ["pets"],
    });
    return {
      results: data.results.map(mapReportToPet),
      total: data.total,
      page: data.page,
      pageSize: data.page_size,
    };
  },

  async findById(id: string): Promise<Pet> {
    const data = await fetchJson<BackendReport>(`/pets/${id}`, undefined, {
      revalidate: 60,
      tags: ["pets", `pet:${id}`],
    });
    return mapReportToPet(data);
  },

  async getStats(): Promise<PetStats> {
    const data = await fetchJson<{
      lost: number;
      found: number;
      reunited: number;
    }>("/pets/stats", undefined, { revalidate: 60, tags: ["pets-stats"] });
    return {
      totalLost: data.lost,
      totalFound: data.found,
      totalReunited: data.reunited,
    };
  },
};
