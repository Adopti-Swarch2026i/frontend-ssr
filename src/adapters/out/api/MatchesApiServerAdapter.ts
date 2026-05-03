import "server-only";
import { getServerEnv } from "@/lib/env";

export interface MatchSuggestion {
  lostPetId: number;
  lostReportId: number;
  lostOwnerId: string;
  foundPetId: number;
  foundReportId: number;
  foundOwnerId: string;
  score: number;
  species: string | null;
  breed: string | null;
  color: string | null;
  city: string | null;
}

interface MatchListResponse {
  petId: number;
  reportId: number;
  totalMatches: number;
  matches: MatchSuggestion[];
}

export interface SearchResultItem {
  petId: number;
  reportId: number;
  name: string | null;
  type: string;
  breed: string | null;
  color: string | null;
  status: string;
  city: string;
  description: string | null;
  imageUrls: string[];
  createdAt: string;
}

interface SearchResponse {
  total: number;
  page: number;
  pageSize: number;
  results: SearchResultItem[];
}

async function fetchJson<T>(
  path: string,
  searchParams?: Record<string, string | number>,
  revalidate = 30
): Promise<T> {
  const env = getServerEnv();
  const url = new URL(env.PETS_API_URL_INTERNAL + path);
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`matches/search request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export const matchesApiServer = {
  async getSuggestions(
    petId: number,
    reportId?: number
  ): Promise<MatchSuggestion[]> {
    try {
      const params = reportId !== undefined ? { reportId } : undefined;
      const data = await fetchJson<MatchListResponse>(
        `/matches/${petId}`,
        params,
        30
      );
      return data.matches ?? [];
    } catch {
      // Fail-soft: si el matching-service no está disponible, no rompemos
      // la página de detalle.
      return [];
    }
  },

  async search(filters: {
    q?: string;
    breed?: string;
    city?: string;
    type?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<SearchResponse> {
    const params: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== null && v !== "") params[k] = v;
    }
    try {
      return await fetchJson<SearchResponse>("/search", params, 15);
    } catch {
      return { total: 0, page: 1, pageSize: 0, results: [] };
    }
  },
};
