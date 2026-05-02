import { DashboardPage } from "@/adapters/in/pages/DashboardPage";
import { petApiServer } from "@/adapters/out/api/PetApiServerAdapter";
import type { PaginatedPets, PetStats } from "@/domain/entities/Pet";

const PAGE_SIZE = 12;

export default async function Page() {
  const emptyPets: PaginatedPets = {
    results: [],
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
  };
  const emptyStats: PetStats = {
    totalLost: 0,
    totalFound: 0,
    totalReunited: 0,
  };

  const [petsResult, statsResult] = await Promise.allSettled([
    petApiServer.findAll({ page: 1, pageSize: PAGE_SIZE }),
    petApiServer.getStats(),
  ]);

  const initialPaginated =
    petsResult.status === "fulfilled" ? petsResult.value : emptyPets;
  const initialStats =
    statsResult.status === "fulfilled" ? statsResult.value : emptyStats;

  return (
    <DashboardPage
      initialPets={initialPaginated.results}
      initialTotal={initialPaginated.total}
      initialStats={initialStats}
    />
  );
}
